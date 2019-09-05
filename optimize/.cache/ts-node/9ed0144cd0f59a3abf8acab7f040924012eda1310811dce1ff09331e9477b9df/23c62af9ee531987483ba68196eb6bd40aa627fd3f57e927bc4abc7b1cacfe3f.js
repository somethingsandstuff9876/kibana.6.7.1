"use strict";
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
exports.pingsSchema = graphql_tag_1.default `
  schema {
    query: Query
  }

  type PingResults {
    total: UnsignedInteger!
    pings: [Ping!]!
  }

  type Query {
    "Get a list of all recorded pings for all monitors"
    allPings(
      sort: String
      size: Int
      monitorId: String
      status: String
      dateRangeStart: String!
      dateRangeEnd: String!
    ): PingResults!

    "Gets the number of documents in the target index"
    getDocCount: DocCount!
  }

  type DocCount {
    count: UnsignedInteger!
  }

  "The monitor's status for a ping"
  type Duration {
    us: Int
  }

  type StatusCode {
    status_code: Int
  }

  "An agent for recording a beat"
  type Beat {
    hostname: String
    name: String
    timezone: String
    type: String
  }

  type Docker {
    id: String
    image: String
    name: String
  }

  type Error {
    code: Int
    message: String
    type: String
  }

  type OS {
    family: String
    kernel: String
    platform: String
    version: String
  }

  type Host {
    architecture: String
    id: String
    ip: String
    mac: String
    name: String
    os: OS
  }

  type HttpRTT {
    content: Duration
    response_header: Duration
    total: Duration
    validate: Duration
    validate_body: Duration
    write_request: Duration
  }

  type HTTP {
    response: StatusCode
    rtt: HttpRTT
    url: String
  }

  type ICMP {
    requests: Int
    rtt: Int
  }

  type KubernetesContainer {
    image: String
    name: String
  }

  type KubernetesNode {
    name: String
  }

  type KubernetesPod {
    name: String
    uid: String
  }

  type Kubernetes {
    container: KubernetesContainer
    namespace: String
    node: KubernetesNode
    pod: KubernetesPod
  }

  type MetaCloud {
    availability_zone: String
    instance_id: String
    instance_name: String
    machine_type: String
    project_id: String
    provider: String
    region: String
  }

  type Meta {
    cloud: MetaCloud
  }

  type Monitor {
    duration: Duration
    host: String
    "The id of the monitor"
    id: String
    "The IP pinged by the monitor"
    ip: String
    "The name of the protocol being monitored"
    name: String
    "The protocol scheme of the monitored host"
    scheme: String
    "The status of the monitored host"
    status: String
    "The type of host being monitored"
    type: String
  }

  type Resolve {
    host: String
    ip: String
    rtt: Duration
  }

  type RTT {
    connect: Duration
    handshake: Duration
    validate: Duration
  }

  type Socks5 {
    rtt: RTT
  }

  type TCP {
    port: Int
    rtt: RTT
  }

  type TLS {
    certificate_not_valid_after: String
    certificate_not_valid_before: String
    certificates: String
    rtt: RTT
  }

  "A request sent from a monitor to a host"
  type Ping {
    "The timestamp of the ping's creation"
    timestamp: String!
    "Milliseconds from the timestamp to the current time"
    millisFromNow: String
    "The agent that recorded the ping"
    beat: Beat
    docker: Docker
    error: Error
    host: Host
    http: HTTP
    icmp: ICMP
    kubernetes: Kubernetes
    meta: Meta
    monitor: Monitor
    resolve: Resolve
    socks5: Socks5
    tags: String
    tcp: TCP
    tls: TLS
  }
`;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvYW50aG9ueS9naXRfd29ya3NwYWNlcy9raWJhbmEveC1wYWNrL3BsdWdpbnMvdXB0aW1lL3NlcnZlci9ncmFwaHFsL3BpbmdzL3NjaGVtYS5ncWwudHMiLCJzb3VyY2VzIjpbIi9ob21lL2FudGhvbnkvZ2l0X3dvcmtzcGFjZXMva2liYW5hL3gtcGFjay9wbHVnaW5zL3VwdGltZS9zZXJ2ZXIvZ3JhcGhxbC9waW5ncy9zY2hlbWEuZ3FsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCxzRUFBOEI7QUFFakIsUUFBQSxXQUFXLEdBQUcscUJBQUcsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQW9NN0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgRWxhc3RpY3NlYXJjaCBCLlYuIGFuZC9vciBsaWNlbnNlZCB0byBFbGFzdGljc2VhcmNoIEIuVi4gdW5kZXIgb25lXG4gKiBvciBtb3JlIGNvbnRyaWJ1dG9yIGxpY2Vuc2UgYWdyZWVtZW50cy4gTGljZW5zZWQgdW5kZXIgdGhlIEVsYXN0aWMgTGljZW5zZTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgRWxhc3RpYyBMaWNlbnNlLlxuICovXG5cbmltcG9ydCBncWwgZnJvbSAnZ3JhcGhxbC10YWcnO1xuXG5leHBvcnQgY29uc3QgcGluZ3NTY2hlbWEgPSBncWxgXG4gIHNjaGVtYSB7XG4gICAgcXVlcnk6IFF1ZXJ5XG4gIH1cblxuICB0eXBlIFBpbmdSZXN1bHRzIHtcbiAgICB0b3RhbDogVW5zaWduZWRJbnRlZ2VyIVxuICAgIHBpbmdzOiBbUGluZyFdIVxuICB9XG5cbiAgdHlwZSBRdWVyeSB7XG4gICAgXCJHZXQgYSBsaXN0IG9mIGFsbCByZWNvcmRlZCBwaW5ncyBmb3IgYWxsIG1vbml0b3JzXCJcbiAgICBhbGxQaW5ncyhcbiAgICAgIHNvcnQ6IFN0cmluZ1xuICAgICAgc2l6ZTogSW50XG4gICAgICBtb25pdG9ySWQ6IFN0cmluZ1xuICAgICAgc3RhdHVzOiBTdHJpbmdcbiAgICAgIGRhdGVSYW5nZVN0YXJ0OiBTdHJpbmchXG4gICAgICBkYXRlUmFuZ2VFbmQ6IFN0cmluZyFcbiAgICApOiBQaW5nUmVzdWx0cyFcblxuICAgIFwiR2V0cyB0aGUgbnVtYmVyIG9mIGRvY3VtZW50cyBpbiB0aGUgdGFyZ2V0IGluZGV4XCJcbiAgICBnZXREb2NDb3VudDogRG9jQ291bnQhXG4gIH1cblxuICB0eXBlIERvY0NvdW50IHtcbiAgICBjb3VudDogVW5zaWduZWRJbnRlZ2VyIVxuICB9XG5cbiAgXCJUaGUgbW9uaXRvcidzIHN0YXR1cyBmb3IgYSBwaW5nXCJcbiAgdHlwZSBEdXJhdGlvbiB7XG4gICAgdXM6IEludFxuICB9XG5cbiAgdHlwZSBTdGF0dXNDb2RlIHtcbiAgICBzdGF0dXNfY29kZTogSW50XG4gIH1cblxuICBcIkFuIGFnZW50IGZvciByZWNvcmRpbmcgYSBiZWF0XCJcbiAgdHlwZSBCZWF0IHtcbiAgICBob3N0bmFtZTogU3RyaW5nXG4gICAgbmFtZTogU3RyaW5nXG4gICAgdGltZXpvbmU6IFN0cmluZ1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG5cbiAgdHlwZSBEb2NrZXIge1xuICAgIGlkOiBTdHJpbmdcbiAgICBpbWFnZTogU3RyaW5nXG4gICAgbmFtZTogU3RyaW5nXG4gIH1cblxuICB0eXBlIEVycm9yIHtcbiAgICBjb2RlOiBJbnRcbiAgICBtZXNzYWdlOiBTdHJpbmdcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxuXG4gIHR5cGUgT1Mge1xuICAgIGZhbWlseTogU3RyaW5nXG4gICAga2VybmVsOiBTdHJpbmdcbiAgICBwbGF0Zm9ybTogU3RyaW5nXG4gICAgdmVyc2lvbjogU3RyaW5nXG4gIH1cblxuICB0eXBlIEhvc3Qge1xuICAgIGFyY2hpdGVjdHVyZTogU3RyaW5nXG4gICAgaWQ6IFN0cmluZ1xuICAgIGlwOiBTdHJpbmdcbiAgICBtYWM6IFN0cmluZ1xuICAgIG5hbWU6IFN0cmluZ1xuICAgIG9zOiBPU1xuICB9XG5cbiAgdHlwZSBIdHRwUlRUIHtcbiAgICBjb250ZW50OiBEdXJhdGlvblxuICAgIHJlc3BvbnNlX2hlYWRlcjogRHVyYXRpb25cbiAgICB0b3RhbDogRHVyYXRpb25cbiAgICB2YWxpZGF0ZTogRHVyYXRpb25cbiAgICB2YWxpZGF0ZV9ib2R5OiBEdXJhdGlvblxuICAgIHdyaXRlX3JlcXVlc3Q6IER1cmF0aW9uXG4gIH1cblxuICB0eXBlIEhUVFAge1xuICAgIHJlc3BvbnNlOiBTdGF0dXNDb2RlXG4gICAgcnR0OiBIdHRwUlRUXG4gICAgdXJsOiBTdHJpbmdcbiAgfVxuXG4gIHR5cGUgSUNNUCB7XG4gICAgcmVxdWVzdHM6IEludFxuICAgIHJ0dDogSW50XG4gIH1cblxuICB0eXBlIEt1YmVybmV0ZXNDb250YWluZXIge1xuICAgIGltYWdlOiBTdHJpbmdcbiAgICBuYW1lOiBTdHJpbmdcbiAgfVxuXG4gIHR5cGUgS3ViZXJuZXRlc05vZGUge1xuICAgIG5hbWU6IFN0cmluZ1xuICB9XG5cbiAgdHlwZSBLdWJlcm5ldGVzUG9kIHtcbiAgICBuYW1lOiBTdHJpbmdcbiAgICB1aWQ6IFN0cmluZ1xuICB9XG5cbiAgdHlwZSBLdWJlcm5ldGVzIHtcbiAgICBjb250YWluZXI6IEt1YmVybmV0ZXNDb250YWluZXJcbiAgICBuYW1lc3BhY2U6IFN0cmluZ1xuICAgIG5vZGU6IEt1YmVybmV0ZXNOb2RlXG4gICAgcG9kOiBLdWJlcm5ldGVzUG9kXG4gIH1cblxuICB0eXBlIE1ldGFDbG91ZCB7XG4gICAgYXZhaWxhYmlsaXR5X3pvbmU6IFN0cmluZ1xuICAgIGluc3RhbmNlX2lkOiBTdHJpbmdcbiAgICBpbnN0YW5jZV9uYW1lOiBTdHJpbmdcbiAgICBtYWNoaW5lX3R5cGU6IFN0cmluZ1xuICAgIHByb2plY3RfaWQ6IFN0cmluZ1xuICAgIHByb3ZpZGVyOiBTdHJpbmdcbiAgICByZWdpb246IFN0cmluZ1xuICB9XG5cbiAgdHlwZSBNZXRhIHtcbiAgICBjbG91ZDogTWV0YUNsb3VkXG4gIH1cblxuICB0eXBlIE1vbml0b3Ige1xuICAgIGR1cmF0aW9uOiBEdXJhdGlvblxuICAgIGhvc3Q6IFN0cmluZ1xuICAgIFwiVGhlIGlkIG9mIHRoZSBtb25pdG9yXCJcbiAgICBpZDogU3RyaW5nXG4gICAgXCJUaGUgSVAgcGluZ2VkIGJ5IHRoZSBtb25pdG9yXCJcbiAgICBpcDogU3RyaW5nXG4gICAgXCJUaGUgbmFtZSBvZiB0aGUgcHJvdG9jb2wgYmVpbmcgbW9uaXRvcmVkXCJcbiAgICBuYW1lOiBTdHJpbmdcbiAgICBcIlRoZSBwcm90b2NvbCBzY2hlbWUgb2YgdGhlIG1vbml0b3JlZCBob3N0XCJcbiAgICBzY2hlbWU6IFN0cmluZ1xuICAgIFwiVGhlIHN0YXR1cyBvZiB0aGUgbW9uaXRvcmVkIGhvc3RcIlxuICAgIHN0YXR1czogU3RyaW5nXG4gICAgXCJUaGUgdHlwZSBvZiBob3N0IGJlaW5nIG1vbml0b3JlZFwiXG4gICAgdHlwZTogU3RyaW5nXG4gIH1cblxuICB0eXBlIFJlc29sdmUge1xuICAgIGhvc3Q6IFN0cmluZ1xuICAgIGlwOiBTdHJpbmdcbiAgICBydHQ6IER1cmF0aW9uXG4gIH1cblxuICB0eXBlIFJUVCB7XG4gICAgY29ubmVjdDogRHVyYXRpb25cbiAgICBoYW5kc2hha2U6IER1cmF0aW9uXG4gICAgdmFsaWRhdGU6IER1cmF0aW9uXG4gIH1cblxuICB0eXBlIFNvY2tzNSB7XG4gICAgcnR0OiBSVFRcbiAgfVxuXG4gIHR5cGUgVENQIHtcbiAgICBwb3J0OiBJbnRcbiAgICBydHQ6IFJUVFxuICB9XG5cbiAgdHlwZSBUTFMge1xuICAgIGNlcnRpZmljYXRlX25vdF92YWxpZF9hZnRlcjogU3RyaW5nXG4gICAgY2VydGlmaWNhdGVfbm90X3ZhbGlkX2JlZm9yZTogU3RyaW5nXG4gICAgY2VydGlmaWNhdGVzOiBTdHJpbmdcbiAgICBydHQ6IFJUVFxuICB9XG5cbiAgXCJBIHJlcXVlc3Qgc2VudCBmcm9tIGEgbW9uaXRvciB0byBhIGhvc3RcIlxuICB0eXBlIFBpbmcge1xuICAgIFwiVGhlIHRpbWVzdGFtcCBvZiB0aGUgcGluZydzIGNyZWF0aW9uXCJcbiAgICB0aW1lc3RhbXA6IFN0cmluZyFcbiAgICBcIk1pbGxpc2Vjb25kcyBmcm9tIHRoZSB0aW1lc3RhbXAgdG8gdGhlIGN1cnJlbnQgdGltZVwiXG4gICAgbWlsbGlzRnJvbU5vdzogU3RyaW5nXG4gICAgXCJUaGUgYWdlbnQgdGhhdCByZWNvcmRlZCB0aGUgcGluZ1wiXG4gICAgYmVhdDogQmVhdFxuICAgIGRvY2tlcjogRG9ja2VyXG4gICAgZXJyb3I6IEVycm9yXG4gICAgaG9zdDogSG9zdFxuICAgIGh0dHA6IEhUVFBcbiAgICBpY21wOiBJQ01QXG4gICAga3ViZXJuZXRlczogS3ViZXJuZXRlc1xuICAgIG1ldGE6IE1ldGFcbiAgICBtb25pdG9yOiBNb25pdG9yXG4gICAgcmVzb2x2ZTogUmVzb2x2ZVxuICAgIHNvY2tzNTogU29ja3M1XG4gICAgdGFnczogU3RyaW5nXG4gICAgdGNwOiBUQ1BcbiAgICB0bHM6IFRMU1xuICB9XG5gO1xuIl19