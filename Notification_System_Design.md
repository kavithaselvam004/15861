# Priority Notification Inbox Design

## Goal

Students lose track of important unread notifications when the notification volume is high. The Priority Inbox shows the top `n` unread notifications first, where `n` can be 10, 15, 20, or any user-selected value.

This submission implements top 10 unread notifications in [priorityInbox.js](priorityInbox.js).

## Priority Model

Each notification receives a score:

```text
priorityScore = categoryWeight + recencyScore
```

Category weights:

```text
placement = 300
result    = 200
event     = 100
```

Recency uses exponential decay:

```text
recencyScore = 100 * 0.5 ^ (ageInMinutes / 180)
```

This means newer notifications receive a higher recency bonus, but category importance still matters strongly. A new placement notification usually ranks above a new result notification, and a result ranks above an event. Within each category, recent unread notifications naturally rise first.

Only unread notifications are considered for the Priority Inbox.

## Efficient Top 10 Maintenance

For a fixed top `n`, the implementation keeps a min-heap of size `n`.

When processing existing notifications:

1. Ignore notifications that are already read.
2. Compute the priority score.
3. Add the notification if the heap has fewer than `n` items.
4. If the heap already has `n` items, compare the new notification with the lowest-priority item in the heap.
5. Replace the heap root only when the new notification has a higher priority.

Complexity:

```text
Initial build: O(m log n), where m is unread notification count
New notification: O(log n)
Read/delete update: O(log n) with an indexed heap, or rebuild O(m log n) for small inboxes
Memory: O(n)
```

Because `n` is small, such as 10, 15, or 20, this is efficient even when the total number of notifications is large.

## Handling Continuous New Notifications

New notifications will keep arriving. The service can maintain one heap per user or per user segment:

```text
userId -> minHeap(topN unread priority notifications)
```

For every incoming notification:

1. Identify target users or target segments.
2. Compute the score using current time.
3. Insert into each affected Priority Inbox heap.
4. If heap size exceeds `n`, remove the lowest-priority item.

Scores include recency, so they change over time. In production, there are two practical options:

1. Re-rank when the user opens the inbox. This is simple and accurate because the latest `now` is used.
2. Periodically refresh active users' heaps if the inbox must always be precomputed.

For this assignment, [priorityInbox.js](priorityInbox.js) demonstrates the functioning top 10 logic without a database query.

## Output Screenshot

The output screenshot is stored at:

```text
screenshots/priority-inbox-output.png
```
