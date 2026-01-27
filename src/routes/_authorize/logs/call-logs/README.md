# Call Log List Page

This page provides comprehensive monitoring and debugging capabilities for API calls and webhook deliveries.

## Features

### API Integration

- ✅ Data fetching hooks for StaffListVendorAPICallLog
- ✅ Data fetching hooks for StaffListWebhookCallLog
- ✅ Filter state management with URL persistence
- ✅ Pagination state management

### UI Components

- ✅ Call Log List page with tabs (Vendor API / Webhook)
- ✅ Data table component with sortable columns
- ✅ Filter panel UI (team, store, status, dates, search)
- ✅ Expandable row/detail view component
- ✅ Pagination controls component

### Display & Formatting

- ✅ Timestamp formatting with timezone handling
- ✅ JSON syntax highlighting for request/response bodies
- ✅ Color-coded HTTP status codes (2xx green, 4xx orange, 5xx red)
- ✅ Duration formatting (ms → readable format)
- ✅ cURL command display with copy button

## File Structure

```
call-logs/
├── index.tsx                           # Main route component with tabs
├── -components/
│   ├── filter.tsx                      # Filter panel component
│   ├── vendor-api-table.tsx           # Vendor API calls table
│   ├── webhook-table.tsx              # Webhook calls table
│   └── table/
│       ├── columns.tsx                 # Table column definitions
│       ├── call-log-table.tsx         # Custom table with expandable rows
│       └── call-log-detail-view.tsx   # Detailed view with JSON highlighting
├── -helper.tsx                         # Filter and pagination helpers
└── README.md                          # This file
```

## Usage

Navigate to `/logs/call-logs` to access the Call Log List page.

### Filtering

- **Search**: Search by Order ID, Request ID, or Response ID
- **Date Range**: Filter by creation date
- **Status**: Filter by HTTP status codes (2xx, 4xx, 5xx, or specific codes)
- **Team**: Filter by team
- **Store**: Filter by store

### Table Features

- **Sorting**: Click column headers to sort
- **Pagination**: Navigate through pages
- **Expandable Rows**: Click the expand button to view detailed information
- **Copy Actions**: Copy Request IDs and cURL commands

### Detail View

The expandable detail view includes:

- **Overview**: Timing, request info, and status
- **Request**: Request headers and body with JSON syntax highlighting
- **Response**: Response headers and body with JSON syntax highlighting
- **cURL**: Copy-ready cURL command

## Data Schema

The implementation uses mock data with the following structure:

```typescript
interface CallLogEntry {
  id: string
  requestId: string
  responseId?: string
  orderId?: string
  teamId: string
  teamName: string
  storeId?: string
  storeName?: string
  method: string
  url: string
  statusCode: number
  statusText: string
  duration: number // in milliseconds
  createdAt: string
  requestHeaders: Record<string, string>
  requestBody?: string
  responseHeaders: Record<string, string>
  responseBody?: string
  errorMessage?: string
  curlCommand: string
}
```

## Integration Notes

To integrate with real APIs, replace the mock implementations in:

- `apps/bizops/src/data-center/call-logs/use-query.tsx`
- Update the filter helpers in `-helper.tsx` to match your API's filter structure
- Update the schemas in `apps/bizops/src/schemas/schemas/call-logs.ts` to match your data structure

## Styling

The implementation uses the existing UI3 component library and follows the established design patterns from the payment logs page.
