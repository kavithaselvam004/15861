const CATEGORY_WEIGHT = {
  placement: 300,
  result: 200,
  event: 100,
};

const RECENCY_HALF_LIFE_MINUTES = 180;
const RECENCY_MAX_POINTS = 100;
const TOP_N = 10;

const notifications = [
  {
    id: 'N-101',
    title: 'Google placement pre-assessment starts at 5 PM',
    category: 'placement',
    createdAt: '2026-06-17T10:20:00+05:30',
    unread: true,
  },
  {
    id: 'N-102',
    title: 'Semester 6 results published in student portal',
    category: 'result',
    createdAt: '2026-06-17T10:12:00+05:30',
    unread: true,
  },
  {
    id: 'N-103',
    title: 'Entrepreneurship cell pitch event venue changed',
    category: 'event',
    createdAt: '2026-06-17T10:38:00+05:30',
    unread: true,
  },
  {
    id: 'N-104',
    title: 'Infosys campus drive shortlist released',
    category: 'placement',
    createdAt: '2026-06-17T09:46:00+05:30',
    unread: true,
  },
  {
    id: 'N-105',
    title: 'Semester 4 revaluation results are available',
    category: 'result',
    createdAt: '2026-06-17T08:55:00+05:30',
    unread: true,
  },
  {
    id: 'N-106',
    title: 'Cultural fest volunteer briefing at 4:30 PM',
    category: 'event',
    createdAt: '2026-06-17T09:15:00+05:30',
    unread: true,
  },
  {
    id: 'N-107',
    title: 'TCS NQT registration deadline extended',
    category: 'placement',
    createdAt: '2026-06-16T18:35:00+05:30',
    unread: true,
  },
  {
    id: 'N-108',
    title: 'Hackathon final round begins tomorrow',
    category: 'event',
    createdAt: '2026-06-17T10:25:00+05:30',
    unread: false,
  },
  {
    id: 'N-109',
    title: 'Capgemini interview slots opened',
    category: 'placement',
    createdAt: '2026-06-17T07:40:00+05:30',
    unread: true,
  },
  {
    id: 'N-110',
    title: 'Semester 2 internal marks verification closes today',
    category: 'result',
    createdAt: '2026-06-17T10:05:00+05:30',
    unread: true,
  },
  {
    id: 'N-111',
    title: 'Sports meet registration desk open in Block A',
    category: 'event',
    createdAt: '2026-06-17T10:30:00+05:30',
    unread: true,
  },
  {
    id: 'N-112',
    title: 'Wipro coding test instructions updated',
    category: 'placement',
    createdAt: '2026-06-17T09:05:00+05:30',
    unread: true,
  },
  {
    id: 'N-113',
    title: 'Semester 1 supplementary results declared',
    category: 'result',
    createdAt: '2026-06-16T21:05:00+05:30',
    unread: true,
  },
  {
    id: 'N-114',
    title: 'Library orientation for first year students',
    category: 'event',
    createdAt: '2026-06-17T08:10:00+05:30',
    unread: true,
  },
  {
    id: 'N-115',
    title: 'Amazon internship application window closes at noon',
    category: 'placement',
    createdAt: '2026-06-17T10:33:00+05:30',
    unread: true,
  },
];

class MinHeap {
  constructor(compare) {
    this.items = [];
    this.compare = compare;
  }

  size() {
    return this.items.length;
  }

  peek() {
    return this.items[0];
  }

  push(item) {
    this.items.push(item);
    this.bubbleUp(this.items.length - 1);
  }

  replaceRoot(item) {
    this.items[0] = item;
    this.bubbleDown(0);
  }

  toSortedDescending() {
    return [...this.items].sort((a, b) => this.compare(b, a));
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.items[index], this.items[parentIndex]) >= 0) {
        break;
      }
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  bubbleDown(index) {
    while (true) {
      const leftIndex = index * 2 + 1;
      const rightIndex = index * 2 + 2;
      let smallestIndex = index;

      if (
        leftIndex < this.items.length &&
        this.compare(this.items[leftIndex], this.items[smallestIndex]) < 0
      ) {
        smallestIndex = leftIndex;
      }

      if (
        rightIndex < this.items.length &&
        this.compare(this.items[rightIndex], this.items[smallestIndex]) < 0
      ) {
        smallestIndex = rightIndex;
      }

      if (smallestIndex === index) {
        break;
      }

      this.swap(index, smallestIndex);
      index = smallestIndex;
    }
  }

  swap(firstIndex, secondIndex) {
    const temp = this.items[firstIndex];
    this.items[firstIndex] = this.items[secondIndex];
    this.items[secondIndex] = temp;
  }
}

function getAgeInMinutes(createdAt, now) {
  return Math.max(0, (now.getTime() - new Date(createdAt).getTime()) / 60000);
}

function getPriorityScore(notification, now) {
  const categoryWeight = CATEGORY_WEIGHT[notification.category] ?? 0;
  const ageInMinutes = getAgeInMinutes(notification.createdAt, now);
  const recencyScore =
    RECENCY_MAX_POINTS * Math.pow(0.5, ageInMinutes / RECENCY_HALF_LIFE_MINUTES);

  return Number((categoryWeight + recencyScore).toFixed(2));
}

function comparePriority(first, second) {
  if (first.score !== second.score) {
    return first.score - second.score;
  }

  return new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime();
}

function findTopUnreadNotifications(allNotifications, topN = TOP_N, now = new Date()) {
  const heap = new MinHeap(comparePriority);

  for (const notification of allNotifications) {
    if (!notification.unread) {
      continue;
    }

    const scoredNotification = {
      ...notification,
      score: getPriorityScore(notification, now),
    };

    if (heap.size() < topN) {
      heap.push(scoredNotification);
    } else if (comparePriority(scoredNotification, heap.peek()) > 0) {
      heap.replaceRoot(scoredNotification);
    }
  }

  return heap.toSortedDescending();
}

function printTopNotifications(topNotifications) {
  console.log('Priority Inbox - Top 10 Unread Notifications');
  console.log('Scoring: placement=300, result=200, event=100 + recency decay bonus');
  console.log('');
  console.table(
    topNotifications.map((notification, index) => ({
      Rank: index + 1,
      ID: notification.id,
      Category: notification.category,
      Score: notification.score,
      Created: notification.createdAt,
      Title: notification.title,
    })),
  );
}

const now = new Date('2026-06-17T10:45:00+05:30');
const topNotifications = findTopUnreadNotifications(notifications, TOP_N, now);

printTopNotifications(topNotifications);

module.exports = {
  findTopUnreadNotifications,
  getPriorityScore,
  MinHeap,
};
