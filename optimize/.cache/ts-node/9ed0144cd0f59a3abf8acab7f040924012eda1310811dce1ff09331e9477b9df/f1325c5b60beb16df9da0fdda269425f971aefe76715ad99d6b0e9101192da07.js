"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.args = ({ userDataDir, viewport, disableSandbox, proxyConfig, verboseLogging, }) => {
    const flags = [
        // Disable built-in Google Translate service
        '--disable-translate',
        // Disable all chrome extensions entirely
        '--disable-extensions',
        // Disable various background network services, including extension updating,
        //   safe browsing service, upgrade detector, translate, UMA
        '--disable-background-networking',
        // Disable fetching safebrowsing lists, likely redundant due to disable-background-networking
        '--safebrowsing-disable-auto-update',
        // Disable syncing to a Google account
        '--disable-sync',
        // Disable reporting to UMA, but allows for collection
        '--metrics-recording-only',
        // Disable installation of default apps on first run
        '--disable-default-apps',
        // Mute any audio
        '--mute-audio',
        // Skip first run wizards
        '--no-first-run',
        `--user-data-dir=${userDataDir}`,
        '--disable-gpu',
        '--headless',
        '--hide-scrollbars',
        `--window-size=${Math.floor(viewport.width)},${Math.floor(viewport.height)}`,
    ];
    if (proxyConfig.enabled) {
        flags.push(`--proxy-server=${proxyConfig.server}`);
        if (proxyConfig.bypass) {
            flags.push(`--proxy-bypass-list=${proxyConfig.bypass.join(',')}`);
        }
    }
    if (disableSandbox) {
        flags.push('--no-sandbox');
    }
    if (verboseLogging) {
        flags.push('--enable-logging');
        flags.push('--v=1');
    }
    if (process.platform === 'linux') {
        flags.push('--disable-setuid-sandbox');
    }
    return [...flags, 'about:blank'];
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvcmVwb3J0aW5nL3NlcnZlci9icm93c2Vycy9jaHJvbWl1bS9kcml2ZXJfZmFjdG9yeS9hcmdzLnRzIiwic291cmNlcyI6WyIvaG9tZS9hbnRob255L2dpdF93b3Jrc3BhY2VzL2tpYmFuYS94LXBhY2svcGx1Z2lucy9yZXBvcnRpbmcvc2VydmVyL2Jyb3dzZXJzL2Nocm9taXVtL2RyaXZlcl9mYWN0b3J5L2FyZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBY1UsUUFBQSxJQUFJLEdBQUcsQ0FBQyxFQUNuQixXQUFXLEVBQ1gsUUFBUSxFQUNSLGNBQWMsRUFDZCxXQUFXLEVBQ1gsY0FBYyxHQUNULEVBQUUsRUFBRTtJQUNULE1BQU0sS0FBSyxHQUFHO1FBQ1osNENBQTRDO1FBQzVDLHFCQUFxQjtRQUNyQix5Q0FBeUM7UUFDekMsc0JBQXNCO1FBQ3RCLDZFQUE2RTtRQUM3RSw0REFBNEQ7UUFDNUQsaUNBQWlDO1FBQ2pDLDZGQUE2RjtRQUM3RixvQ0FBb0M7UUFDcEMsc0NBQXNDO1FBQ3RDLGdCQUFnQjtRQUNoQixzREFBc0Q7UUFDdEQsMEJBQTBCO1FBQzFCLG9EQUFvRDtRQUNwRCx3QkFBd0I7UUFDeEIsaUJBQWlCO1FBQ2pCLGNBQWM7UUFDZCx5QkFBeUI7UUFDekIsZ0JBQWdCO1FBQ2hCLG1CQUFtQixXQUFXLEVBQUU7UUFDaEMsZUFBZTtRQUNmLFlBQVk7UUFDWixtQkFBbUI7UUFDbkIsaUJBQWlCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0tBQzdFLENBQUM7SUFFRixJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUU7UUFDdkIsS0FBSyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDbkQsSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQ3RCLEtBQUssQ0FBQyxJQUFJLENBQUMsdUJBQXVCLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNuRTtLQUNGO0lBRUQsSUFBSSxjQUFjLEVBQUU7UUFDbEIsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUM1QjtJQUVELElBQUksY0FBYyxFQUFFO1FBQ2xCLEtBQUssQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUMvQixLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3JCO0lBRUQsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRTtRQUNoQyxLQUFLLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7S0FDeEM7SUFFRCxPQUFPLENBQUMsR0FBRyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDbkMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCBFbGFzdGljc2VhcmNoIEIuVi4gYW5kL29yIGxpY2Vuc2VkIHRvIEVsYXN0aWNzZWFyY2ggQi5WLiB1bmRlciBvbmVcbiAqIG9yIG1vcmUgY29udHJpYnV0b3IgbGljZW5zZSBhZ3JlZW1lbnRzLiBMaWNlbnNlZCB1bmRlciB0aGUgRWxhc3RpYyBMaWNlbnNlO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBFbGFzdGljIExpY2Vuc2UuXG4gKi9cblxuaW50ZXJmYWNlIE9wdHMge1xuICB1c2VyRGF0YURpcjogc3RyaW5nO1xuICB2aWV3cG9ydDogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9O1xuICBkaXNhYmxlU2FuZGJveDogYm9vbGVhbjtcbiAgcHJveHlDb25maWc6IHtcbiAgICBlbmFibGVkOiBib29sZWFuO1xuICAgIHNlcnZlcjogc3RyaW5nO1xuICAgIGJ5cGFzcz86IHN0cmluZ1tdO1xuICB9O1xuICB2ZXJib3NlTG9nZ2luZzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IGFyZ3MgPSAoe1xuICB1c2VyRGF0YURpcixcbiAgdmlld3BvcnQsXG4gIGRpc2FibGVTYW5kYm94LFxuICBwcm94eUNvbmZpZyxcbiAgdmVyYm9zZUxvZ2dpbmcsXG59OiBPcHRzKSA9PiB7XG4gIGNvbnN0IGZsYWdzID0gW1xuICAgIC8vIERpc2FibGUgYnVpbHQtaW4gR29vZ2xlIFRyYW5zbGF0ZSBzZXJ2aWNlXG4gICAgJy0tZGlzYWJsZS10cmFuc2xhdGUnLFxuICAgIC8vIERpc2FibGUgYWxsIGNocm9tZSBleHRlbnNpb25zIGVudGlyZWx5XG4gICAgJy0tZGlzYWJsZS1leHRlbnNpb25zJyxcbiAgICAvLyBEaXNhYmxlIHZhcmlvdXMgYmFja2dyb3VuZCBuZXR3b3JrIHNlcnZpY2VzLCBpbmNsdWRpbmcgZXh0ZW5zaW9uIHVwZGF0aW5nLFxuICAgIC8vICAgc2FmZSBicm93c2luZyBzZXJ2aWNlLCB1cGdyYWRlIGRldGVjdG9yLCB0cmFuc2xhdGUsIFVNQVxuICAgICctLWRpc2FibGUtYmFja2dyb3VuZC1uZXR3b3JraW5nJyxcbiAgICAvLyBEaXNhYmxlIGZldGNoaW5nIHNhZmVicm93c2luZyBsaXN0cywgbGlrZWx5IHJlZHVuZGFudCBkdWUgdG8gZGlzYWJsZS1iYWNrZ3JvdW5kLW5ldHdvcmtpbmdcbiAgICAnLS1zYWZlYnJvd3NpbmctZGlzYWJsZS1hdXRvLXVwZGF0ZScsXG4gICAgLy8gRGlzYWJsZSBzeW5jaW5nIHRvIGEgR29vZ2xlIGFjY291bnRcbiAgICAnLS1kaXNhYmxlLXN5bmMnLFxuICAgIC8vIERpc2FibGUgcmVwb3J0aW5nIHRvIFVNQSwgYnV0IGFsbG93cyBmb3IgY29sbGVjdGlvblxuICAgICctLW1ldHJpY3MtcmVjb3JkaW5nLW9ubHknLFxuICAgIC8vIERpc2FibGUgaW5zdGFsbGF0aW9uIG9mIGRlZmF1bHQgYXBwcyBvbiBmaXJzdCBydW5cbiAgICAnLS1kaXNhYmxlLWRlZmF1bHQtYXBwcycsXG4gICAgLy8gTXV0ZSBhbnkgYXVkaW9cbiAgICAnLS1tdXRlLWF1ZGlvJyxcbiAgICAvLyBTa2lwIGZpcnN0IHJ1biB3aXphcmRzXG4gICAgJy0tbm8tZmlyc3QtcnVuJyxcbiAgICBgLS11c2VyLWRhdGEtZGlyPSR7dXNlckRhdGFEaXJ9YCxcbiAgICAnLS1kaXNhYmxlLWdwdScsXG4gICAgJy0taGVhZGxlc3MnLFxuICAgICctLWhpZGUtc2Nyb2xsYmFycycsXG4gICAgYC0td2luZG93LXNpemU9JHtNYXRoLmZsb29yKHZpZXdwb3J0LndpZHRoKX0sJHtNYXRoLmZsb29yKHZpZXdwb3J0LmhlaWdodCl9YCxcbiAgXTtcblxuICBpZiAocHJveHlDb25maWcuZW5hYmxlZCkge1xuICAgIGZsYWdzLnB1c2goYC0tcHJveHktc2VydmVyPSR7cHJveHlDb25maWcuc2VydmVyfWApO1xuICAgIGlmIChwcm94eUNvbmZpZy5ieXBhc3MpIHtcbiAgICAgIGZsYWdzLnB1c2goYC0tcHJveHktYnlwYXNzLWxpc3Q9JHtwcm94eUNvbmZpZy5ieXBhc3Muam9pbignLCcpfWApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChkaXNhYmxlU2FuZGJveCkge1xuICAgIGZsYWdzLnB1c2goJy0tbm8tc2FuZGJveCcpO1xuICB9XG5cbiAgaWYgKHZlcmJvc2VMb2dnaW5nKSB7XG4gICAgZmxhZ3MucHVzaCgnLS1lbmFibGUtbG9nZ2luZycpO1xuICAgIGZsYWdzLnB1c2goJy0tdj0xJyk7XG4gIH1cblxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2xpbnV4Jykge1xuICAgIGZsYWdzLnB1c2goJy0tZGlzYWJsZS1zZXR1aWQtc2FuZGJveCcpO1xuICB9XG5cbiAgcmV0dXJuIFsuLi5mbGFncywgJ2Fib3V0OmJsYW5rJ107XG59O1xuIl19