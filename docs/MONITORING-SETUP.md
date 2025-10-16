# Monitoring & Alerting Setup

## Sentry Configuration

### Current Setup
Sentry is integrated in the BB-PRODX platform for comprehensive error tracking and performance monitoring.

**Configuration Files:**
- `sentry.client.config.ts` - Client-side monitoring
- `sentry.server.config.ts` - Server-side monitoring
- `sentry.edge.config.ts` - Edge runtime monitoring

### Environment Variables Required
```env
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=bb-prodx
SENTRY_AUTH_TOKEN=your-auth-token
```

### Error Alerting Rules

#### Critical Errors (Immediate Notification)
**Trigger:** Any error with level "fatal" or "critical"
**Notification:** Email, Slack, PagerDuty
**Response Time:** < 5 minutes

```javascript
// Example critical error tracking
Sentry.captureException(error, {
  level: 'critical',
  tags: {
    section: 'payment',
    action: 'checkout'
  }
});
```

#### High Error Rate Alert
**Trigger:** Error rate > 5% of requests
**Window:** 5 minute sliding window
**Notification:** Email, Slack
**Auto-escalation:** If not acknowledged in 15 minutes

#### Slow Endpoint Alert
**Trigger:** P95 response time > 3 seconds
**Endpoints Monitored:**
- `/api/checkout`
- `/api/products`
- `/api/auth/*`
**Notification:** Email to engineering team

#### Failed Authentication Alert
**Trigger:** > 10 failed auth attempts per minute from same IP
**Action:** Auto-block IP for 30 minutes
**Notification:** Security team via Slack

### Performance Monitoring

#### Transaction Tracing
```javascript
// Enabled for all API routes
tracesSampleRate: 0.1, // 10% of transactions

// 100% sampling for critical paths
beforeSendTransaction(event) {
  if (event.transaction?.includes('/api/checkout')) {
    event.sampleRate = 1.0;
  }
  return event;
}
```

#### Custom Performance Metrics
- Database query time
- API response time
- React component render time
- Next.js page load time

### Custom Tags & Context

All errors include:
```javascript
{
  environment: process.env.NODE_ENV,
  version: process.env.NEXT_PUBLIC_VERSION,
  user_role: session?.user?.role,
  feature_flag: activeFeatures,
  deployment_id: process.env.VERCEL_DEPLOYMENT_ID
}
```

### Alert Channels

#### Email Notifications
- **Critical:** engineering@betterbeing.com
- **High Priority:** dev-team@betterbeing.com
- **Standard:** monitoring@betterbeing.com

#### Slack Integration
```
Channel: #bb-prodx-alerts
Webhook: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

#### PagerDuty Integration
```
Service Key: YOUR-PAGERDUTY-SERVICE-KEY
Escalation Policy: BB-PRODX-OnCall
```

### Dashboard Configuration

#### Main Dashboard Panels
1. **Error Rate** - Real-time error rate graph
2. **Performance** - P50/P95/P99 latencies
3. **User Impact** - Number of affected users
4. **Release Health** - Crash-free rate by version
5. **Top Issues** - Most frequent errors

#### Custom Dashboards
- **Checkout Flow** - Payment-specific monitoring
- **Auth Flow** - Login/signup success rates
- **API Health** - Endpoint-specific metrics
- **Database Performance** - Query performance

### Issue Prioritization

| Priority | Criteria | Response Time |
|----------|----------|---------------|
| P0 | Site down, payment failures | < 15 minutes |
| P1 | Critical feature broken | < 1 hour |
| P2 | Degraded performance | < 4 hours |
| P3 | Minor bugs | < 24 hours |
| P4 | Improvements | Next sprint |

### On-Call Rotation

#### Schedule
- **Primary:** Weekdays 9am-6pm EST
- **Secondary:** Nights and weekends
- **Rotation:** Weekly, starting Monday

#### Escalation Path
1. Primary on-call engineer (5 min)
2. Secondary on-call (10 min)
3. Engineering lead (15 min)
4. CTO (30 min)

### Monitoring Checklist

#### Daily Checks
- [ ] Review error rate trends
- [ ] Check performance metrics
- [ ] Verify all endpoints healthy
- [ ] Review user feedback

#### Weekly Reviews
- [ ] Analyze top issues
- [ ] Performance regression check
- [ ] Update alert thresholds
- [ ] Review false positives

#### Monthly Reviews
- [ ] Incident post-mortems
- [ ] Alert effectiveness
- [ ] Coverage analysis
- [ ] Team training needs

### Integration with CI/CD

#### Pre-deployment Checks
```bash
# Check Sentry for critical issues
sentry-cli releases list --org=your-org --project=bb-prodx

# Create new release
sentry-cli releases new $VERSION

# Upload source maps
sentry-cli releases files $VERSION upload-sourcemaps ./build

# Set commits
sentry-cli releases set-commits $VERSION --auto

# Finalize release
sentry-cli releases finalize $VERSION
```

#### Post-deployment Monitoring
- Monitor error rate for 30 minutes
- Check for new error types
- Verify performance metrics
- Rollback trigger: >2x baseline error rate

### Error Budget Policy

**Monthly Error Budget:** 99.9% uptime (43 minutes downtime)

**Budget Consumption:**
- Complete outage: 1 minute per minute
- Partial outage: 0.5 minutes per minute
- Degraded performance: 0.25 minutes per minute

**When Budget Exhausted:**
- Feature freeze
- Focus on reliability improvements
- Post-mortem required

### Logging Integration

#### Log Aggregation
- **Provider:** Sentry with console integration
- **Retention:** 30 days standard, 90 days for errors
- **Search:** Full-text search across all logs

#### Structured Logging
```javascript
logger.info('Order completed', {
  orderId: order.id,
  userId: user.id,
  amount: order.total,
  duration: performance.now() - startTime
});
```

### Health Check Endpoints

#### Application Health
`GET /api/health`
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 86400,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### Database Health
`GET /api/health/db`
```json
{
  "status": "connected",
  "latency": 5,
  "connections": 10,
  "maxConnections": 100
}
```

#### Dependencies Health
`GET /api/health/deps`
```json
{
  "stripe": "operational",
  "sendgrid": "operational",
  "redis": "degraded"
}
```

### Incident Response Playbooks

#### Payment Failure Surge
1. Check Stripe status page
2. Review recent deployments
3. Check database connections
4. Review error logs
5. Implement feature flag kill switch if needed

#### Authentication Failures
1. Check NextAuth logs
2. Verify OAuth provider status
3. Check database user table
4. Review recent auth changes
5. Clear session cache if needed

#### Performance Degradation
1. Check database slow queries
2. Review recent code changes
3. Check external API latencies
4. Scale resources if needed
5. Enable caching if disabled

### Metrics to Track

#### Business Metrics
- Conversion rate
- Cart abandonment rate
- Average order value
- User registration rate

#### Technical Metrics
- API response time
- Database query time
- Cache hit rate
- Error rate by endpoint
- Build success rate

#### User Experience Metrics
- Core Web Vitals (LCP, FID, CLS)
- Time to interactive
- First contentful paint
- JavaScript bundle size

### Reporting

#### Daily Report
- Error count and rate
- Performance summary
- Active incidents
- Deployment summary

#### Weekly Report
- Top issues and resolution
- Performance trends
- Uptime percentage
- Team velocity

#### Monthly Report
- SLA compliance
- Incident analysis
- Cost analysis
- Capacity planning

### Security Monitoring

#### Suspicious Activity Detection
- Multiple failed login attempts
- Unusual traffic patterns
- SQL injection attempts
- XSS attempts

#### Automated Responses
- IP blocking for suspicious activity
- Rate limiting enforcement
- Alert security team
- Capture forensic data

### Cost Optimization

#### Alert Noise Reduction
- Group similar errors
- Implement sampling for high-volume errors
- Set appropriate thresholds
- Regular alert tuning

#### Resource Optimization
- Monitor Sentry event usage
- Optimize trace sampling rates
- Archive old data
- Review retention policies