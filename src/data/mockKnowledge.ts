import { KnowledgeDocument, KnowledgeArticle, RAGMessage } from '../types';

export const INITIAL_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'doc-1',
    title: 'SOP-204: PayWave Gateway Merchant Authorization Failure Triage',
    category: 'Payment Engineering',
    department: 'Card Processing & Acquiring',
    author: 'Vikram Joshi (Acquiring Head)',
    uploadDate: '2026-10-15',
    status: 'Indexed',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    pages: 18,
    excerpt: 'Standard operational protocol for diagnosing merchant authorization timeout spikes, HSM tokenization bottlenecks, and card scheme switch failover procedures.',
    content: `Standard Operating Procedure SOP-204: PayWave Authorization Triage
1. Overview: PayWave connects merchant POS terminals and e-commerce gateways to card networks (Visa, Mastercard, RuPay).
2. Triage Steps:
   - Check upstream HTTP response latency from switch nodes. Normal baseline is < 350ms.
   - Inspect HSM (Hardware Security Module) tokenization thread pools via JMX telemetry.
   - If latency > 5000ms, immediately engage L2 on-call and check card network status feeds.
   - Execute failover to secondary datacenter switch if packet loss on primary exceeds 2%.
3. Escalation Matrix: Level 1 (5 mins) -> Level 2 (15 mins) -> Level 3 (30 mins) -> VP Delivery.`,
  },
  {
    id: 'doc-2',
    title: 'RUNBOOK-102: PostgreSQL Connection Saturation & Pool Starvation Recovery',
    category: 'Database Infrastructure',
    department: 'Cloud & Database Operations',
    author: 'James Wilson (Principal DBA)',
    uploadDate: '2026-10-10',
    status: 'Indexed',
    fileType: 'MD',
    fileSize: '840 KB',
    pages: 12,
    excerpt: 'Emergency runbook for PostgreSQL max_connections saturation, identifying leaking client pools, terminating idle transactions, and tuning PgBouncer.',
    content: `RUNBOOK-102: PostgreSQL Connection Saturation
1. Diagnostic Query:
   SELECT pid, usename, client_addr, state, now() - state_change as duration, query
   FROM pg_stat_activity
   WHERE state = 'idle in transaction' AND (now() - state_change) > interval '5 minutes';
2. Remediation Protocol:
   - Run pg_terminate_backend(pid) for hanging client processes.
   - Check downstream microservices (FinEdge, DemoBank Core) HikariCP connection pool settings.
   - Ensure maximum pool size per pod does not exceed 25 connections.
   - Verify PgBouncer connection queue depth and client timeout limits.`,
  },
  {
    id: 'doc-3',
    title: 'EM-01: Enterprise Incident Escalation Matrix & SLA Policy 2026',
    category: 'IT Governance',
    department: 'Incident Management Office',
    author: 'Marcus Vance (VP Service Delivery)',
    uploadDate: '2026-09-20',
    status: 'Indexed',
    fileType: 'PDF',
    fileSize: '3.1 MB',
    pages: 24,
    excerpt: 'Organizational severity levels (P1 to P4), maximum allowable MTTR thresholds, notification distribution trees, and management executive paging protocols.',
    content: `Enterprise Escalation Matrix & SLA Standards:
- Severity 1 (Critical): SLA 60 minutes. Escalation: L1 immediate -> L2 at 15m -> L3 at 30m -> Executive pager at 45m.
- Severity 2 (High): SLA 240 minutes. Escalation: L1 at 30m -> L2 at 60m -> L3 at 120m.
- Severity 3 (Medium): SLA 720 minutes. Regular business hours queue review.
- Severity 4 (Low): SLA 1440 minutes. Next scheduled release sprint.`,
  },
  {
    id: 'doc-4',
    title: 'SOP-310: Keycloak SSO & Redis Session Eviction Troubleshooting',
    category: 'Identity & Security',
    department: 'Cybersecurity & IAM',
    author: 'Michael Scott (Identity & Access)',
    uploadDate: '2026-10-05',
    status: 'Indexed',
    fileType: 'DOCX',
    fileSize: '1.8 MB',
    pages: 15,
    excerpt: 'Detailed operational manual for Keycloak token issuance latency, Redis cluster allkeys-lru eviction storms, and session cache recovery.',
    content: `SOP-310: Keycloak SSO & Session Cache Recovery
- Symptom: Elevated customer login times (> 3s) or intermittent 502/504 errors on auth endpoints.
- Check Redis maxmemory policy: Must be set to volatile-lru, not allkeys-lru, to avoid evicting active user refresh tokens.
- Review token expiration jitter to avoid thundering herd problem during peak 09:00 and 14:00 spikes.`,
  },
  {
    id: 'doc-5',
    title: 'RUNBOOK-405: NEFT & RTGS Interbank Clearing Settlement Glitch Protocol',
    category: 'Core Banking',
    department: 'Interbank Settlement Operations',
    author: 'Siddharth Rao (Settlement Operations)',
    uploadDate: '2026-10-18',
    status: 'Indexed',
    fileType: 'PDF',
    fileSize: '2.9 MB',
    pages: 20,
    excerpt: 'Procedures for ISO20022 clearing message validation failures, payment quarantine isolation, and manual bilateral reconciliation.',
    content: `RUNBOOK-405: Interbank Settlement Failure Protocol
1. Check Central Clearing House BGP gateway socket status.
2. If XML schema validation fails on batch payloads, inspect ISO20022 header tags <SttlmInf> and <CdtrAgt>.
3. Quarantined transactions must not be rejected automatically; place in hold state until clearing window cycle extension is granted by regulator.`,
  },
  {
    id: 'doc-6',
    title: 'GUIDE-501: Kubernetes Worker Node Disk Pressure & Log Eviction Remediation',
    category: 'Cloud Infrastructure',
    department: 'Site Reliability Engineering',
    author: 'Elena Rostova (DevOps Architect)',
    uploadDate: '2026-10-12',
    status: 'Indexed',
    fileType: 'MD',
    fileSize: '620 KB',
    pages: 9,
    excerpt: 'Step-by-step procedure to cordon nodes, clean up container runtime images, adjust kubelet eviction thresholds, and configure log rotation.',
    content: `GUIDE-501: K8s Node Disk Pressure Remediation
1. Identify affected node: kubectl get nodes -o wide --sort-by=.status.conditions
2. Cordon node: kubectl cordon <node-name>
3. Evict non-critical pods: kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data
4. SSH into node and execute docker/containerd prune: crictl rmi --prune
5. Check log directory: du -sh /var/log/pods/* and verify Fluentbit daemonset status.`,
  },
  {
    id: 'doc-7',
    title: 'SOP-118: Core Account Ledger JVM Garbage Collection & Heap Optimization',
    category: 'Core Banking',
    department: 'Tier-2 Application Engineering',
    author: 'Priya Sharma (Support Engineer)',
    uploadDate: '2026-09-28',
    status: 'Indexed',
    fileType: 'PDF',
    fileSize: '1.9 MB',
    pages: 14,
    excerpt: 'Detecting memory leaks in ledger balance snapshot calculation, capturing thread and heap dumps via jcmd, and tuning G1GC pause targets.',
    content: `SOP-118: Ledger JVM Memory Leak Remediation
- Monitor JVM Heap Old Gen utilization. If > 85% persistently, trigger automated diagnostic dump:
  jcmd <pid> GC.run
  jcmd <pid> Thread.print > /tmp/thread_dump.txt
  jcmd <pid> GC.heap_dump /tmp/heap_dump.hprof
- Gracefully drain traffic through load balancer before restarting worker node.`,
  },
  {
    id: 'doc-8',
    title: 'RUNBOOK-303: API Gateway Envoy Rate Limiting False Positive Mitigation',
    category: 'API Platform',
    department: 'Platform Infrastructure',
    author: 'Sophia Lin (Platform Infrastructure)',
    uploadDate: '2026-10-02',
    status: 'Indexed',
    fileType: 'MD',
    fileSize: '510 KB',
    pages: 8,
    excerpt: 'Mitigating unexpected HTTP 429 errors for certified open banking partners, adjusting token bucket burst capacities, and CIDR overrides.',
    content: `RUNBOOK-303: Envoy Rate Limiter Override Protocol
- Partner open banking certified IPs are listed in configmap envoy-rate-limit-tiers.
- If partners report unexpected 429 errors after deployment, apply immediate whitelist patch:
  kubectl edit configmap envoy-rate-limit-tiers -n api-gateway
  Set partner tier to TIER_UNLIMITED_EXEMPT.
- Issue rolling reload to Envoy pods without terminating active client TCP connections.`,
  },
  {
    id: 'doc-9',
    title: 'MANUAL-22: Datadog Synthetic Monitoring Alert Triage for Web Applications',
    category: 'Observability',
    department: 'Digital Operations',
    author: 'Elena Rostova (Operations Lead)',
    uploadDate: '2026-10-01',
    status: 'Indexed',
    fileType: 'PDF',
    fileSize: '1.6 MB',
    pages: 11,
    excerpt: 'Differentiating real production outages from synthetic agent browser step timeouts, global CDN POP latency, and third-party script blocks.',
    content: `MANUAL-22: Synthetic Test Outage Verification
1. Compare synthetic failure across multiple testing locations (US-East, EU-West, AP-East).
2. If failure is localized to a single region, check edge CDN Anycast routing tables before declaring application outage.
3. Verify synthetic test script credentials and MFA bypass tokens have not expired.`,
  },
  {
    id: 'doc-10',
    title: 'SOP-602: Apple APNs & Google FCM Push Notification Certificate Renewal',
    category: 'Mobile Platform',
    department: 'Mobile Engineering',
    author: 'Rachel Zane (Customer Engagement)',
    uploadDate: '2026-09-15',
    status: 'Indexed',
    fileType: 'DOCX',
    fileSize: '1.2 MB',
    pages: 7,
    excerpt: 'Annual certificate generation via Apple Developer Portal, CSR creation via HashiCorp Vault, and zero-downtime deployment to push dispatcher.',
    content: `SOP-602: Push Notification Credential Management
- APNs certificates expire every 365 days. Alerts fire at T-30, T-14, and T-3 days.
- Vault stores push tokens at secret/mobile/apns_token.
- Update secret and trigger deployment rollout restart on mobile-push-service namespace.`,
  },
  {
    id: 'doc-11',
    title: 'RUNBOOK-801: Kafka Consumer Lag & Partition Rebalance Troubleshooting',
    category: 'Event Architecture',
    department: 'PayWave Reconciliation Team',
    author: 'Thomas Brown (Treasury & Settlement)',
    uploadDate: '2026-09-10',
    status: 'Indexed',
    fileType: 'MD',
    fileSize: '750 KB',
    pages: 13,
    excerpt: 'Resolving partition lag spikes, consumer group rebalance storms, max.poll.interval.ms tuning, and scaling worker pods.',
    content: `RUNBOOK-801: Kafka Consumer Lag Resolution
1. Check lag metrics: kafka-consumer-groups.sh --bootstrap-server <broker> --describe --group settlement-processor
2. If lag > 50,000 messages, verify if consumer pods are repeatedly leaving and rejoining group.
3. Increase max.poll.interval.ms from 300000 to 600000 if batch processing takes longer during month-end.`,
  },
  {
    id: 'doc-12',
    title: 'POLICY-04: Automated Cloud Backup & Disaster Recovery RPO/RTO Standards',
    category: 'Disaster Recovery',
    department: 'Enterprise Risk & Compliance',
    author: 'Marcus Vance (VP Service Delivery)',
    uploadDate: '2026-08-30',
    status: 'Indexed',
    fileType: 'PDF',
    fileSize: '4.2 MB',
    pages: 32,
    excerpt: 'Enterprise recovery point objectives (RPO < 15 mins) and recovery time objectives (RTO < 60 mins) across core financial platforms.',
    content: `Enterprise DR Guidelines:
- Tier 1 Systems: Continuous WAL shipping, automated cross-region replication, pilot-light standby database with synchronous replication.
- Backup validation tests must run bi-weekly in isolated UAT environments.`,
  },
  {
    id: 'doc-13',
    title: 'SOP-409: RabbitMQ Cluster Split-Brain Healing & Quorum Queue Recovery',
    category: 'Cloud Infrastructure',
    department: 'Site Reliability Engineering',
    author: 'Alex Morgan (Incident Commander)',
    uploadDate: '2026-09-05',
    status: 'Indexed',
    fileType: 'MD',
    fileSize: '910 KB',
    pages: 10,
    excerpt: 'Resolving pause_minority state, verifying Erlang cookie consistency, re-synchronizing mirror queues, and clearing corrupted Mnesia tables.',
    content: `SOP-409: RabbitMQ Split Brain Recovery
1. Check cluster status: rabbitmqctl cluster_status
2. For isolated nodes in pause_minority:
   - rabbitmqctl stop_app
   - rabbitmqctl reset
   - rabbitmqctl join_cluster rabbit@node-1
   - rabbitmqctl start_app
3. Verify queue synchronisation: rabbitmqctl list_queues name messages_ready slave_pids synchronised_slave_pids`,
  },
  {
    id: 'doc-14',
    title: 'GUIDE-108: Core Banking Batch Job Deadlock Resolution & SQL Lock Trees',
    category: 'Core Banking',
    department: 'Night Batch Operations',
    author: 'Sarah Jenkins (Batch Ops)',
    uploadDate: '2026-08-14',
    status: 'Indexed',
    fileType: 'DOCX',
    fileSize: '2.1 MB',
    pages: 16,
    excerpt: 'Investigating database deadlock graphs, identifying blocking SQL statements, terminating deadlocked sessions, and safe batch replay.',
    content: `GUIDE-108: Batch Deadlock Mitigation
- When ORA-00060 or PG deadlocks occur:
- Query blocking lock chains:
  SELECT blocked_locks.pid AS blocked_pid, blocking_locks.pid AS blocking_pid, blocked_activity.query AS blocked_statement
  FROM pg_catalog.pg_locks blocked_locks ...
- Safely cancel blocking query and retry failed batch partition.`,
  },
  {
    id: 'doc-15',
    title: 'SOP-515: Cloudflare WAF & Edge Cipher Suite Maintenance Guide',
    category: 'Network Security',
    department: 'Network & Security Operations',
    author: 'Derek Vance (Network Security)',
    uploadDate: '2026-08-01',
    status: 'Indexed',
    fileType: 'PDF',
    fileSize: '1.4 MB',
    pages: 9,
    excerpt: 'Standard operating procedure for rotating edge TLS certificates, managing cipher suites, and testing legacy client compatibility.',
    content: `SOP-515: TLS Cipher Rotation
- Before disabling older ciphers (e.g. CBC ciphers or TLS 1.1), review Cloudflare analytics for legacy client user-agent distribution.
- Ensure automated canary testing runs against mobile test devices before global propagation.`,
  },
];

export const INITIAL_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-1',
    title: 'How to Resolve Payment Gateway Timeout (HTTP 504) Spikes in PayWave',
    description: 'Comprehensive troubleshooting procedure for investigating upstream latency, thread pool starvation, and switch failover.',
    category: 'Payment Engineering',
    department: 'PayWave L3 Engineering',
    author: 'Vikram Joshi',
    lastUpdated: '2026-10-31',
    helpfulCount: 84,
    notHelpfulCount: 2,
    views: 1420,
    tags: ['PayWave', 'HTTP 504', 'Card Authorization', 'HSM', 'Timeout'],
    steps: [
      'Check Grafana dashboard: PayWave Switch -> Response Latency p95 and p99.',
      'Check upstream scheme connections (Visa BASE I, Mastercard MIP) for network packet drops.',
      'Inspect HSM tokenization queue depth. If queue > 500, verify hardware crypto card health.',
      'If a specific switch node (e.g. node-03) is unresponsive, drain traffic via load balancer.',
      'Initiate rolling restart of container pods with JVM flight recorder attached.',
      'Verify authorization success rate climbs back above 99.5% within 5 minutes of node drain.',
    ],
    contentMarkdown: `### Issue Overview
HTTP 504 Gateway Timeouts occur when the PayWave authorization switch fails to receive an authorization response from the tokenization engine or card network switch within the configured 8000ms threshold.

### Root Causes
1. **Thread Pool Exhaustion**: High concurrent transaction volume exceeding default worker pool limits.
2. **HSM Tokenizer Saturation**: Hardware crypto accelerator socket buffer overflow.
3. **Upstream Leased Line Congestion**: Dedicated network circuit latency spike.

### Verification Checklist
- [ ] Ensure health check endpoint \`/api/v1/health\` responds \`200 OK\`.
- [ ] Confirm no orphaned transactions in the pending authorization buffer.`,
    relatedIncidents: ['DEMO-INC-0001', 'DEMO-INC-0007', 'DEMO-INC-0018'],
    relatedDocuments: ['doc-1', 'doc-3'],
  },
  {
    id: 'art-2',
    title: 'PostgreSQL Database Connection Pool Starvation & Max Connections Saturation',
    description: 'Diagnosing idle-in-transaction connection leaks, terminating rogue sessions, and tuning client Hikari pools.',
    category: 'Database Infrastructure',
    department: 'Cloud & Database Operations',
    author: 'James Wilson',
    lastUpdated: '2026-10-31',
    helpfulCount: 96,
    notHelpfulCount: 1,
    views: 1890,
    tags: ['PostgreSQL', 'Connection Pool', 'HikariCP', 'pg_stat_activity', 'Starvation'],
    steps: [
      'Execute query to find long-running idle transactions: \`SELECT pid, state, now()-state_change FROM pg_stat_activity WHERE state="idle in transaction";\`',
      'Identify offending client IP or microservice pod.',
      'Execute \`SELECT pg_terminate_backend(pid);\` on idle transactions older than 10 minutes.',
      'Inspect application client pool settings: reduce maximumPoolSize from 50 to 20 per pod.',
      'Enable \`idle_in_transaction_session_timeout = 60000\` (1 minute) in PostgreSQL parameter group.',
      'Restart PgBouncer connection pooling layer if client connection handles remain hung.',
    ],
    contentMarkdown: `### Symptom & Diagnostic Pattern
When PostgreSQL reaches its maximum connection limit (e.g. 2000 connections), new incoming connections from application servers will fail with:
\`FATAL: remaining connection slots are reserved for non-replication superuser connections\`.

### Permanent Prevention
- Set \`leakDetectionThreshold = 60000\` in HikariCP configuration to automatically log stack traces of unclosed connection calls.
- Enforce connection pooling via PgBouncer in transaction mode rather than session mode.`,
    relatedIncidents: ['DEMO-INC-0002', 'DEMO-INC-0010'],
    relatedDocuments: ['doc-2', 'doc-3'],
  },
  {
    id: 'art-3',
    title: 'Troubleshooting Keycloak SSO & Redis Session Cache Eviction Storms',
    description: 'Restoring authentication responsiveness when Redis cache memory pressure causes premature customer logout.',
    category: 'Identity & Access',
    department: 'Cybersecurity & IAM',
    author: 'Michael Scott',
    lastUpdated: '2026-10-31',
    helpfulCount: 62,
    notHelpfulCount: 3,
    views: 1120,
    tags: ['Keycloak', 'Redis', 'SSO', 'Eviction', 'OIDC', 'Latency'],
    steps: [
      'Check Redis memory usage: \`redis-cli info memory\` and verify \`used_memory_rss\`.',
      'Verify eviction policy: ensure \`maxmemory-policy\` is set to \`volatile-lru\` or \`volatile-ttl\`.',
      'Inspect slowlog: \`redis-cli slowlog get 10\` to identify multi-key searches or unindexed session tokens.',
      'Temporarily scale Redis cache cluster memory by 50% via AWS ElastiCache / Redis Enterprise.',
      'Run purge script for expired anonymous user session state records.',
      'Verify login page response time returns under 800ms.',
    ],
    contentMarkdown: `### Issue Analysis
When Redis session cache is configured with \`allkeys-lru\`, high memory usage forces Redis to evict active customer tokens alongside idle sessions, triggering high latency and invalid session errors on subsequent API calls.`,
    relatedIncidents: ['DEMO-INC-0003', 'DEMO-INC-0020'],
    relatedDocuments: ['doc-4', 'doc-3'],
  },
  {
    id: 'art-4',
    title: 'ISO20022 Clearing XML Parsing Failure & Remittance Quarantine Protocol',
    category: 'Core Banking',
    department: 'Interbank Settlement Operations',
    author: 'Siddharth Rao',
    lastUpdated: '2026-10-30',
    helpfulCount: 51,
    notHelpfulCount: 0,
    views: 940,
    tags: ['NEFT', 'RTGS', 'ISO20022', 'Clearing', 'Quarantine'],
    steps: [
      'Locate error log in \`/var/log/settlement/iso20022_parser.log\`.',
      'Identify failing line and tag (e.g., currency code, BIC code mismatch).',
      'Do NOT discard batch payload; mark records as STATUS_HELD_FOR_REVIEW.',
      'Notify Central Clearing House desk via secure operations chat and request payload validation.',
      'Once replacement or corrected batch file is received, run through staging validator before re-ingestion.',
    ],
    contentMarkdown: `### Regulatory Compliance
Quarantined interbank clearing batches must be resolved before the 19:00 UTC cutoff window to prevent regulatory liquidity penalties.`,
    relatedIncidents: ['DEMO-INC-0004', 'DEMO-INC-0022'],
    relatedDocuments: ['doc-5'],
  },
  {
    id: 'art-5',
    title: 'Recovering Kubernetes Worker Nodes from Disk Pressure & Pod Eviction',
    category: 'Cloud Infrastructure',
    department: 'Site Reliability Engineering',
    author: 'Elena Rostova',
    lastUpdated: '2026-10-29',
    helpfulCount: 77,
    notHelpfulCount: 2,
    views: 1350,
    tags: ['Kubernetes', 'DiskPressure', 'Eviction', 'crictl', 'Fluentbit'],
    steps: [
      'Run \`kubectl describe node <node-name>\` and verify DiskPressure condition = True.',
      'Cordon node immediately: \`kubectl cordon <node-name>\` to prevent new pod scheduling.',
      'SSH into worker host and check disk usage: \`df -h /var/lib/docker\` and \`df -h /var/log\`.',
      'Clean dangling images: \`crictl rmi --prune\`.',
      'Purge rotated log files older than 3 days: \`find /var/log/pods -name "*.log.*" -delete\`.',
      'Uncordon node once disk utilization drops below 75%: \`kubectl uncordon <node-name>\`.',
    ],
    contentMarkdown: `### Root Cause Prevention
Configure kubelet eviction thresholds in kubelet-config:
\`imageGCHighThresholdPercent: 80\`
\`imageGCLowThresholdPercent: 70\`
Ensure Fluentbit daemonset is configured with max file buffer caps.`,
    relatedIncidents: ['DEMO-INC-0010', 'DEMO-INC-0026'],
    relatedDocuments: ['doc-6', 'doc-13'],
  },
  {
    id: 'art-6',
    title: 'Core Banking Ledger JVM Memory Leak & Garbage Collection Pause Recovery',
    category: 'Core Banking',
    department: 'Core Banking L2 Team',
    author: 'David Chen',
    lastUpdated: '2026-10-28',
    helpfulCount: 48,
    notHelpfulCount: 1,
    views: 870,
    tags: ['Java', 'G1GC', 'Memory Leak', 'Heap Dump', 'Ledger'],
    steps: [
      'Inspect Prometheus metric \`jvm_gc_pause_seconds_max\`. If > 2.0s, alert L2 on-call.',
      'Capture thread dump: \`kill -3 <pid>\` or \`jcmd <pid> Thread.print\`.',
      'Trigger heap dump to EBS storage: \`jcmd <pid> GC.heap_dump /data/dumps/heap.hprof\`.',
      'Perform graceful rolling restart of ledger service pod.',
      'Inspect heap dump using Eclipse MAT to identify leaking object instances (typically unevicted Cache maps).',
    ],
    contentMarkdown: `### Best Practice
Never execute \`kill -9\` on active banking ledger JVMs. Allow active accounting balance locks to release gracefully.`,
    relatedIncidents: ['DEMO-INC-0011', 'DEMO-INC-0008'],
    relatedDocuments: ['doc-7', 'doc-14'],
  },
  {
    id: 'art-7',
    title: 'BGP Routing Failover & Leased Line Peering Restoration for Payment Networks',
    category: 'Network & Security',
    department: 'Network Operations',
    author: 'Derek Vance',
    lastUpdated: '2026-10-27',
    helpfulCount: 59,
    notHelpfulCount: 0,
    views: 1040,
    tags: ['BGP', 'MPLS', 'Networking', 'UPI', 'Failover'],
    steps: [
      'Check router BGP neighbor state: \`show ip bgp summary\` on Cisco ASR core routers.',
      'If primary MPLS circuit neighbor state is Active or Idle, initiate line diagnostics with telecom NOC.',
      'Verify automatic failover to IPSec VPN route converged.',
      'Tune BGP timers: ensure keepalive is set to 10s and holdtime is set to 30s for rapid flap detection.',
      'Test end-to-end payment gateway heartbeat ping with National Clearing Switch.',
    ],
    contentMarkdown: `### Network Resilience Architecture
Nexus payment switch uses dual redundant active-passive links with multi-cloud IPSec overlay for 99.999% availability.`,
    relatedIncidents: ['DEMO-INC-0007', 'DEMO-INC-0016'],
    relatedDocuments: ['doc-1', 'doc-15'],
  },
  {
    id: 'art-8',
    title: 'Datadog Synthetic Monitoring Alert Triage & CDN False Positive Verification',
    category: 'Observability',
    department: 'Digital Operations',
    author: 'Elena Rostova',
    lastUpdated: '2026-10-25',
    helpfulCount: 42,
    notHelpfulCount: 2,
    views: 790,
    tags: ['Datadog', 'Synthetics', 'CDN', 'Monitoring', 'False Positive'],
    steps: [
      'Open synthetic test execution trace in Datadog / Dynatrace.',
      'Check if failure is confined to a single geographic testing agent (e.g. Sydney or Tokyo).',
      'Test DNS resolution and HTTP latency to origin servers directly bypassing edge CDN.',
      'If origin server is healthy, purge edge POP cache and contact CDN provider NOC.',
      'Adjust test step timeout threshold if undersea cable rerouting adds expected trans-oceanic latency.',
    ],
    contentMarkdown: `### Alert Fatigue Reduction
Do not escalate P1 alerts for single-agent synthetic failures without confirming multi-location quorum consensus (at least 3 regions failing).`,
    relatedIncidents: ['DEMO-INC-0027', 'DEMO-INC-0012'],
    relatedDocuments: ['doc-9', 'doc-15'],
  },
  {
    id: 'art-9',
    title: 'Kafka Consumer Lag Reduction & Partition Rebalance Management',
    category: 'Event Architecture',
    department: 'PayWave Reconciliation Team',
    author: 'Thomas Brown',
    lastUpdated: '2026-10-22',
    helpfulCount: 65,
    notHelpfulCount: 1,
    views: 1180,
    tags: ['Kafka', 'Consumer Lag', 'Rebalance', 'Settlement', 'Throughput'],
    steps: [
      'Identify lagging topic and partition using kafka-consumer-groups tool.',
      'Determine if lag is due to slow processing or thread blockage in consumer logic.',
      'Scale consumer worker deployment replicas up to match topic partition count.',
      'Tune \`max.poll.records\` down if individual records require intensive database write operations.',
      'Verify consumer heartbeat interval to avoid inadvertent partition rebalance triggers.',
    ],
    contentMarkdown: `### Scaling Rule
A Kafka consumer group cannot have more active consumer pods than the number of partitions in the subscribed topic. Additional pods will remain idle.`,
    relatedIncidents: ['DEMO-INC-0013', 'DEMO-INC-0032'],
    relatedDocuments: ['doc-11', 'doc-13'],
  },
  {
    id: 'art-10',
    title: 'Database Batch Job Row-Level Deadlock Mitigation in Oracle & PostgreSQL',
    category: 'Core Banking',
    department: 'Night Batch Operations',
    author: 'Sarah Jenkins',
    lastUpdated: '2026-10-20',
    helpfulCount: 54,
    notHelpfulCount: 0,
    views: 920,
    tags: ['Database', 'Deadlock', 'SQL', 'Batch', 'Locking'],
    steps: [
      'Extract deadlock graph from database alert log or pg_log.',
      'Identify both competing SQL statements and locked row IDs.',
      'Determine why lock ordering was inverted between the two transactions.',
      'Kill blocking transaction session to allow primary batch process to complete.',
      'Update code to enforce consistent alphabetical/chronological table lock acquisition order.',
    ],
    contentMarkdown: `### Mathematical Certainty
Deadlocks are prevented deterministically by ensuring all concurrent processes acquire row-level locks in the exact same deterministic primary key order.`,
    relatedIncidents: ['DEMO-INC-0008', 'DEMO-INC-0025'],
    relatedDocuments: ['doc-14', 'doc-2'],
  },
];

export const INITIAL_RAG_CONVERSATIONS: { query: string; response: RAGMessage }[] = [
  {
    query: 'How do I troubleshoot payment gateway failures?',
    response: {
      id: 'rag-resp-1',
      role: 'assistant',
      content: `Based on **SOP-204 (PayWave Gateway Merchant Authorization Failure Triage)** and Article **#ART-1**, follow this immediate diagnostic sequence:

1. **Check Upstream HTTP Latency**: Inspect PayWave Switch metrics in Prometheus/Grafana. Normal baseline is < 350ms. If latency exceeds 5000ms, immediately engage the L2 on-call engineer.
2. **Examine HSM Tokenization Pools**: Inspect JMX telemetry for Hardware Security Module tokenization queue depth. A queue greater than 500 indicates crypto accelerator saturation.
3. **Card Scheme Connectivity**: Verify status feeds from card networks (Visa BASE I, Mastercard MIP, RuPay). If packet loss exceeds 2%, initiate automated failover to the secondary datacenter switch.
4. **Isolate Impaired Nodes**: If an isolated node (e.g. \`switch-prod-03\`) exhibits thread pool deadlocks, drain traffic immediately via the edge load balancer while capturing JVM flight recorder profiles.

*SLA Warning*: Merchant authorization timeout rate > 5% triggers a **Severity 1 (Critical)** classification requiring executive notification within 45 minutes.`,
      timestamp: '2026-10-31T18:00:00Z',
      citations: [
        {
          docTitle: 'SOP-204: PayWave Gateway Merchant Authorization Failure Triage',
          page: 4,
          snippet: 'If latency > 5000ms, immediately engage L2 on-call and check card network status feeds. Execute failover to secondary datacenter switch if packet loss on primary exceeds 2%.',
        },
        {
          docTitle: 'EM-01: Enterprise Incident Escalation Matrix & SLA Policy 2026',
          page: 7,
          snippet: 'Severity 1 (Critical): SLA 60 minutes. Escalation: L1 immediate -> L2 at 15m -> L3 at 30m -> Executive pager at 45m.',
        },
      ],
      suggestedFollowUps: [
        'What is the failover command for the secondary payment switch?',
        'Show similar historical incidents for PayWave authorization latency.',
        'What are the escalation contacts for the card network liaison?',
      ],
    },
  },
  {
    query: 'What is the escalation procedure for DemoBank incidents?',
    response: {
      id: 'rag-resp-2',
      role: 'assistant',
      content: `According to **EM-01 (Enterprise Incident Escalation Matrix & SLA Policy 2026)**, DemoBank Core incidents follow strict tiered time-based escalation thresholds:

- **Severity 1 (P1 - Critical)**:
  - **Resolution SLA**: 60 minutes maximum MTTR.
  - **T+0 min**: Incident Commander paged; L1 support acknowledged.
  - **T+15 min**: Auto-escalation to **L2 Core Banking Team** if unassigned or unresolved.
  - **T+30 min**: Escalation to **L3 Principal Engineering & Lead Architect (David Chen)**.
  - **T+45 min**: Executive Management pager activated (Marcus Vance, VP Service Delivery).
- **Severity 2 (P2 - High)**:
  - **Resolution SLA**: 240 minutes (4 hours).
  - Escalated to L2 within 30 minutes; L3 within 120 minutes.
- **Severity 3 (P3 - Medium)**: SLA 720 minutes (12 hours). Regular queue assignment.
- **Severity 4 (P4 - Low)**: SLA 1440 minutes (24 hours). Next scheduled sprint release.`,
      timestamp: '2026-10-31T17:30:00Z',
      citations: [
        {
          docTitle: 'EM-01: Enterprise Incident Escalation Matrix & SLA Policy 2026',
          page: 2,
          snippet: 'Severity 1 (Critical): SLA 60 minutes. Escalation: L1 immediate -> L2 at 15m -> L3 at 30m -> Executive pager at 45m.',
        },
      ],
      suggestedFollowUps: [
        'How do I trigger a manual management escalation?',
        'Who is currently on-call for DemoBank Core Banking?',
      ],
    },
  },
  {
    query: 'Find the SOP for database connection issues.',
    response: {
      id: 'rag-resp-3',
      role: 'assistant',
      content: `Found **RUNBOOK-102: PostgreSQL Connection Saturation & Pool Starvation Recovery** and Article **#ART-2**.

### Quick Remediation Steps:
1. Run diagnostic query to identify offending idle transactions:
   \`\`\`sql
   SELECT pid, usename, client_addr, state, now() - state_change as duration, query
   FROM pg_stat_activity
   WHERE state = 'idle in transaction' AND (now() - state_change) > interval '5 minutes';
   \`\`\`
2. Terminate hung sessions:
   \`\`\`sql
   SELECT pg_terminate_backend(pid);
   \`\`\`
3. Verify client connection pool caps in application pods (HikariCP maximumPoolSize should be limited to 20-25 per pod).
4. Inspect PgBouncer connection queue depth and client timeout limits.`,
      timestamp: '2026-10-31T16:45:00Z',
      citations: [
        {
          docTitle: 'RUNBOOK-102: PostgreSQL Connection Saturation & Pool Starvation Recovery',
          page: 3,
          snippet: 'Run pg_terminate_backend(pid) for hanging client processes. Check downstream microservices HikariCP connection pool settings.',
        },
      ],
      suggestedFollowUps: [
        'How do I tune HikariCP leak detection threshold?',
        'Show active database incidents right now.',
      ],
    },
  },
  {
    query: 'How do I resolve API timeout errors?',
    response: {
      id: 'rag-resp-4',
      role: 'assistant',
      content: `Per **RUNBOOK-303 (API Gateway Envoy Rate Limiting & Timeout Mitigation)**:

1. **Verify Ingress vs. Origin**: Inspect Envoy edge access logs (\`x-envoy-upstream-service-time\`). If upstream time is high, the delay is in backend microservices. If upstream time is null, the gateway timed out attempting socket connection.
2. **Check Rate Limiter Thresholds**: Verify whether client IP is being throttled with HTTP 429 prematurely.
3. **Apply Emergency Whitelist**:
   \`\`\`bash
   kubectl edit configmap envoy-rate-limit-tiers -n api-gateway
   \`\`\`
   Set partner tier to \`TIER_UNLIMITED_EXEMPT\` and issue a rolling reload to Envoy pods without terminating active TCP connections.`,
      timestamp: '2026-10-31T15:20:00Z',
      citations: [
        {
          docTitle: 'RUNBOOK-303: API Gateway Envoy Rate Limiting False Positive Mitigation',
          page: 5,
          snippet: 'Set partner tier to TIER_UNLIMITED_EXEMPT. Issue rolling reload to Envoy pods without terminating active client TCP connections.',
        },
      ],
      suggestedFollowUps: [
        'What are the default rate limits for partner APIs?',
        'How do I view Envoy proxy telemetry in Grafana?',
      ],
    },
  },
  {
    query: 'What are the troubleshooting steps for browser monitoring failures?',
    response: {
      id: 'rag-resp-5',
      role: 'assistant',
      content: `Referencing **MANUAL-22: Datadog Synthetic Monitoring Alert Triage for Web Applications**:

1. **Multi-Location Consensus**: Differentiate localized network transit glitches from actual service outages. Verify if failure occurs across at least 3 global testing probes (e.g. US-East, EU-West, AP-East).
2. **Direct Origin Testing**: Bypass edge CDN Anycast routing by querying origin load balancers directly to determine if the failure is caused by an edge cache purge issue or ISP undersea fiber routing.
3. **Credential & MFA Expiry Check**: Ensure synthetic test user session tokens or test OTP bypass keys have not expired.
4. **Step Timeout Adjustment**: For trans-pacific monitoring probes, increase step timeout threshold from 5000ms to 8000ms during planned undersea fiber maintenance windows.`,
      timestamp: '2026-10-31T14:10:00Z',
      citations: [
        {
          docTitle: 'MANUAL-22: Datadog Synthetic Monitoring Alert Triage for Web Applications',
          page: 4,
          snippet: 'Compare synthetic failure across multiple testing locations. If localized to single region, check edge CDN Anycast routing tables.',
        },
      ],
      suggestedFollowUps: [
        'How do I temporarily mute a Datadog synthetic monitor?',
        'View related incident DEMO-INC-0027 resolution.',
      ],
    },
  },
];
