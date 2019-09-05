"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../common/constants");
const errors_1 = require("./errors");
const get_space_selector_url_1 = require("./get_space_selector_url");
const spaces_url_parser_1 = require("./spaces_url_parser");
function initSpacesRequestInterceptors(server) {
    const serverBasePath = server.config().get('server.basePath');
    server.ext('onRequest', async function spacesOnRequestHandler(request, h) {
        const path = request.path;
        // If navigating within the context of a space, then we store the Space's URL Context on the request,
        // and rewrite the request to not include the space identifier in the URL.
        const spaceId = spaces_url_parser_1.getSpaceIdFromPath(path, serverBasePath);
        if (spaceId !== constants_1.DEFAULT_SPACE_ID) {
            const reqBasePath = `/s/${spaceId}`;
            request.setBasePath(reqBasePath);
            const newLocation = path.substr(reqBasePath.length) || '/';
            const newUrl = {
                ...request.url,
                path: newLocation,
                pathname: newLocation,
                href: newLocation,
            };
            request.setUrl(newUrl);
        }
        return h.continue;
    });
    server.ext('onPostAuth', async function spacesOnRequestHandler(request, h) {
        const path = request.path;
        const isRequestingKibanaRoot = path === '/';
        const isRequestingApplication = path.startsWith('/app');
        // if requesting the application root, then show the Space Selector UI to allow the user to choose which space
        // they wish to visit. This is done "onPostAuth" to allow the Saved Objects Client to use the request's auth scope,
        // which is not available at the time of "onRequest".
        if (isRequestingKibanaRoot) {
            try {
                const spacesClient = server.plugins.spaces.spacesClient.getScopedClient(request);
                const spaces = await spacesClient.getAll();
                const config = server.config();
                const basePath = config.get('server.basePath');
                const defaultRoute = config.get('server.defaultRoute');
                if (spaces.length === 1) {
                    // If only one space is available, then send user there directly.
                    // No need for an interstitial screen where there is only one possible outcome.
                    const space = spaces[0];
                    const destination = spaces_url_parser_1.addSpaceIdToPath(basePath, space.id, defaultRoute);
                    return h.redirect(destination).takeover();
                }
                if (spaces.length > 0) {
                    // render spaces selector instead of home page
                    const app = server.getHiddenUiAppById('space_selector');
                    return (await h.renderApp(app, { spaces })).takeover();
                }
            }
            catch (error) {
                return errors_1.wrapError(error);
            }
        }
        // This condition should only happen after selecting a space, or when transitioning from one application to another
        // e.g.: Navigating from Dashboard to Timelion
        if (isRequestingApplication) {
            let spaceId;
            try {
                const spacesClient = server.plugins.spaces.spacesClient.getScopedClient(request);
                spaceId = spaces_url_parser_1.getSpaceIdFromPath(request.getBasePath(), serverBasePath);
                server.log(['spaces', 'debug'], `Verifying access to space "${spaceId}"`);
                await spacesClient.get(spaceId);
            }
            catch (error) {
                server.log(['spaces', 'error'], `Unable to navigate to space "${spaceId}", redirecting to Space Selector. ${error}`);
                // Space doesn't exist, or user not authorized for space, or some other issue retrieving the active space.
                return h.redirect(get_space_selector_url_1.getSpaceSelectorUrl(server.config())).takeover();
            }
        }
        return h.continue;
    });
}
exports.initSpacesRequestInterceptors = initSpacesRequestInterceptors;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvc3BhY2VzL3NlcnZlci9saWIvc3BhY2VfcmVxdWVzdF9pbnRlcmNlcHRvcnMudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3NwYWNlcy9zZXJ2ZXIvbGliL3NwYWNlX3JlcXVlc3RfaW50ZXJjZXB0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOztBQUVILHNEQUEwRDtBQUMxRCxxQ0FBcUM7QUFDckMscUVBQStEO0FBQy9ELDJEQUEyRTtBQUUzRSxTQUFnQiw2QkFBNkIsQ0FBQyxNQUFXO0lBQ3ZELE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUU5RCxNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLFVBQVUsc0JBQXNCLENBQUMsT0FBWSxFQUFFLENBQU07UUFDaEYsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUUxQixxR0FBcUc7UUFDckcsMEVBQTBFO1FBQzFFLE1BQU0sT0FBTyxHQUFHLHNDQUFrQixDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztRQUV6RCxJQUFJLE9BQU8sS0FBSyw0QkFBZ0IsRUFBRTtZQUNoQyxNQUFNLFdBQVcsR0FBRyxNQUFNLE9BQU8sRUFBRSxDQUFDO1lBQ3BDLE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFakMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDO1lBRTNELE1BQU0sTUFBTSxHQUFHO2dCQUNiLEdBQUcsT0FBTyxDQUFDLEdBQUc7Z0JBQ2QsSUFBSSxFQUFFLFdBQVc7Z0JBQ2pCLFFBQVEsRUFBRSxX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Q0FBQyxRQUFRLENBQUMsNENBQW1CLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQzthQUNwRTtTQUNGO1FBQ0QsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXhGRCxzRUF3RkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IEVsYXN0aWNzZWFyY2ggQi5WLiBhbmQvb3IgbGljZW5zZWQgdG8gRWxhc3RpY3NlYXJjaCBCLlYuIHVuZGVyIG9uZVxuICogb3IgbW9yZSBjb250cmlidXRvciBsaWNlbnNlIGFncmVlbWVudHMuIExpY2Vuc2VkIHVuZGVyIHRoZSBFbGFzdGljIExpY2Vuc2U7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIEVsYXN0aWMgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgeyBERUZBVUxUX1NQQUNFX0lEIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyB3cmFwRXJyb3IgfSBmcm9tICcuL2Vycm9ycyc7XG5pbXBvcnQgeyBnZXRTcGFjZVNlbGVjdG9yVXJsIH0gZnJvbSAnLi9nZXRfc3BhY2Vfc2VsZWN0b3JfdXJsJztcbmltcG9ydCB7IGFkZFNwYWNlSWRUb1BhdGgsIGdldFNwYWNlSWRGcm9tUGF0aCB9IGZyb20gJy4vc3BhY2VzX3VybF9wYXJzZXInO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdFNwYWNlc1JlcXVlc3RJbnRlcmNlcHRvcnMoc2VydmVyOiBhbnkpIHtcbiAgY29uc3Qgc2VydmVyQmFzZVBhdGggPSBzZXJ2ZXIuY29uZmlnKCkuZ2V0KCdzZXJ2ZXIuYmFzZVBhdGgnKTtcblxuICBzZXJ2ZXIuZXh0KCdvblJlcXVlc3QnLCBhc3luYyBmdW5jdGlvbiBzcGFjZXNPblJlcXVlc3RIYW5kbGVyKHJlcXVlc3Q6IGFueSwgaDogYW55KSB7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVlc3QucGF0aDtcblxuICAgIC8vIElmIG5hdmlnYXRpbmcgd2l0aGluIHRoZSBjb250ZXh0IG9mIGEgc3BhY2UsIHRoZW4gd2Ugc3RvcmUgdGhlIFNwYWNlJ3MgVVJMIENvbnRleHQgb24gdGhlIHJlcXVlc3QsXG4gICAgLy8gYW5kIHJld3JpdGUgdGhlIHJlcXVlc3QgdG8gbm90IGluY2x1ZGUgdGhlIHNwYWNlIGlkZW50aWZpZXIgaW4gdGhlIFVSTC5cbiAgICBjb25zdCBzcGFjZUlkID0gZ2V0U3BhY2VJZEZyb21QYXRoKHBhdGgsIHNlcnZlckJhc2VQYXRoKTtcblxuICAgIGlmIChzcGFjZUlkICE9PSBERUZBVUxUX1NQQUNFX0lEKSB7XG4gICAgICBjb25zdCByZXFCYXNlUGF0aCA9IGAvcy8ke3NwYWNlSWR9YDtcbiAgICAgIHJlcXVlc3Quc2V0QmFzZVBhdGgocmVxQmFzZVBhdGgpO1xuXG4gICAgICBjb25zdCBuZXdMb2NhdGlvbiA9IHBhdGguc3Vic3RyKHJlcUJhc2VQYXRoLmxlbmd0aCkgfHwgJy8nO1xuXG4gICAgICBjb25zdCBuZXdVcmwgPSB7XG4gICAgICAgIC4uLnJlcXVlc3QudXJsLFxuICAgICAgICBwYXRoOiBuZXdMb2NhdGlvbixcbiAgICAgICAgcGF0aG5hbWU6IG5ld0xvY2F0aW9uLFxuICAgICAgICBocmVmOiBuZXdMb2NhdGlvbixcbiAgICAgIH07XG5cbiAgICAgIHJlcXVlc3Quc2V0VXJsKG5ld1VybCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGguY29udGludWU7XG4gIH0pO1xuXG4gIHNlcnZlci5leHQoJ29uUG9zdEF1dGgnLCBhc3luYyBmdW5jdGlvbiBzcGFjZXNPblJlcXVlc3RIYW5kbGVyKHJlcXVlc3Q6IGFueSwgaDogYW55KSB7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVlc3QucGF0aDtcblxuICAgIGNvbnN0IGlzUmVxdWVzdGluZ0tpYmFuYVJvb3QgPSBwYXRoID09PSAnLyc7XG4gICAgY29uc3QgaXNSZXF1ZXN0aW5nQXBwbGljYXRpb24gPSBwYXRoLnN0YXJ0c1dpdGgoJy9hcHAnKTtcblxuICAgIC8vIGlmIHJlcXVlc3RpbmcgdGhlIGFwcGxpY2F0aW9uIHJvb3QsIHRoZW4gc2hvdyB0aGUgU3BhY2UgU2VsZWN0b3IgVUkgdG8gYWxsb3cgdGhlIHVzZXIgdG8gY2hvb3NlIHdoaWNoIHNwYWNlXG4gICAgLy8gdGhleSB3aXNoIHRvIHZpc2l0LiBUaGlzIGlzIGRvbmUgXCJvblBvc3RBdXRoXCIgdG8gYWxsb3cgdGhlIFNhdmVkIE9iamVjdHMgQ2xpZW50IHRvIHVzZSB0aGUgcmVxdWVzdCdzIGF1dGggc2NvcGUsXG4gICAgLy8gd2hpY2ggaXMgbm90IGF2YWlsYWJsZSBhdCB0aGUgdGltZSBvZiBcIm9uUmVxdWVzdFwiLlxuICAgIGlmIChpc1JlcXVlc3RpbmdLaWJhbmFSb290KSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBzcGFjZXNDbGllbnQgPSBzZXJ2ZXIucGx1Z2lucy5zcGFjZXMuc3BhY2VzQ2xpZW50LmdldFNjb3BlZENsaWVudChyZXF1ZXN0KTtcbiAgICAgICAgY29uc3Qgc3BhY2VzID0gYXdhaXQgc3BhY2VzQ2xpZW50LmdldEFsbCgpO1xuXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHNlcnZlci5jb25maWcoKTtcbiAgICAgICAgY29uc3QgYmFzZVBhdGggPSBjb25maWcuZ2V0KCdzZXJ2ZXIuYmFzZVBhdGgnKTtcbiAgICAgICAgY29uc3QgZGVmYXVsdFJvdXRlID0gY29uZmlnLmdldCgnc2VydmVyLmRlZmF1bHRSb3V0ZScpO1xuXG4gICAgICAgIGlmIChzcGFjZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgLy8gSWYgb25seSBvbmUgc3BhY2UgaXMgYXZhaWxhYmxlLCB0aGVuIHNlbmQgdXNlciB0aGVyZSBkaXJlY3RseS5cbiAgICAgICAgICAvLyBObyBuZWVkIGZvciBhbiBpbnRlcnN0aXRpYWwgc2NyZWVuIHdoZXJlIHRoZXJlIGlzIG9ubHkgb25lIHBvc3NpYmxlIG91dGNvbWUuXG4gICAgICAgICAgY29uc3Qgc3BhY2UgPSBzcGFjZXNbMF07XG5cbiAgICAgICAgICBjb25zdCBkZXN0aW5hdGlvbiA9IGFkZFNwYWNlSWRUb1BhdGgoYmFzZVBhdGgsIHNwYWNlLmlkLCBkZWZhdWx0Um91dGUpO1xuICAgICAgICAgIHJldHVybiBoLnJlZGlyZWN0KGRlc3RpbmF0aW9uKS50YWtlb3ZlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNwYWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgLy8gcmVuZGVyIHNwYWNlcyBzZWxlY3RvciBpbnN0ZWFkIG9mIGhvbWUgcGFnZVxuICAgICAgICAgIGNvbnN0IGFwcCA9IHNlcnZlci5nZXRIaWRkZW5VaUFwcEJ5SWQoJ3NwYWNlX3NlbGVjdG9yJyk7XG4gICAgICAgICAgcmV0dXJuIChhd2FpdCBoLnJlbmRlckFwcChhcHAsIHsgc3BhY2VzIH0pKS50YWtlb3ZlcigpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gd3JhcEVycm9yKGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGlzIGNvbmRpdGlvbiBzaG91bGQgb25seSBoYXBwZW4gYWZ0ZXIgc2VsZWN0aW5nIGEgc3BhY2UsIG9yIHdoZW4gdHJhbnNpdGlvbmluZyBmcm9tIG9uZSBhcHBsaWNhdGlvbiB0byBhbm90aGVyXG4gICAgLy8gZS5nLjogTmF2aWdhdGluZyBmcm9tIERhc2hib2FyZCB0byBUaW1lbGlvblxuICAgIGlmIChpc1JlcXVlc3RpbmdBcHBsaWNhdGlvbikge1xuICAgICAgbGV0IHNwYWNlSWQ7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBzcGFjZXNDbGllbnQgPSBzZXJ2ZXIucGx1Z2lucy5zcGFjZXMuc3BhY2VzQ2xpZW50LmdldFNjb3BlZENsaWVudChyZXF1ZXN0KTtcbiAgICAgICAgc3BhY2VJZCA9IGdldFNwYWNlSWRGcm9tUGF0aChyZXF1ZXN0LmdldEJhc2VQYXRoKCksIHNlcnZlckJhc2VQYXRoKTtcblxuICAgICAgICBzZXJ2ZXIubG9nKFsnc3BhY2VzJywgJ2RlYnVnJ10sIGBWZXJpZnlpbmcgYWNjZXNzIHRvIHNwYWNlIFwiJHtzcGFjZUlkfVwiYCk7XG5cbiAgICAgICAgYXdhaXQgc3BhY2VzQ2xpZW50LmdldChzcGFjZUlkKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHNlcnZlci5sb2coXG4gICAgICAgICAgWydzcGFjZXMnLCAnZXJyb3InXSxcbiAgICAgICAgICBgVW5hYmxlIHRvIG5hdmlnYXRlIHRvIHNwYWNlIFwiJHtzcGFjZUlkfVwiLCByZWRpcmVjdGluZyB0byBTcGFjZSBTZWxlY3Rvci4gJHtlcnJvcn1gXG4gICAgICAgICk7XG4gICAgICAgIC8vIFNwYWNlIGRvZXNuJ3QgZXhpc3QsIG9yIHVzZXIgbm90IGF1dGhvcml6ZWQgZm9yIHNwYWNlLCBvciBzb21lIG90aGVyIGlzc3VlIHJldHJpZXZpbmcgdGhlIGFjdGl2ZSBzcGFjZS5cbiAgICAgICAgcmV0dXJuIGgucmVkaXJlY3QoZ2V0U3BhY2VTZWxlY3RvclVybChzZXJ2ZXIuY29uZmlnKCkpKS50YWtlb3ZlcigpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaC5jb250aW51ZTtcbiAgfSk7XG59XG4iXX0=