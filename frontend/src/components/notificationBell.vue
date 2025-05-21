<template>
  <div class="position-relative" @click="toggleDropdown" style="cursor: pointer;">
    <!-- Bell Icon -->
    <i class="bi bi-bell fs-5 position-relative">
      <!-- Red Dot -->
      <span
        v-if="unreadCount > 0"
        class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
        style="width: 10px; height: 10px;"
      ></span>
    </i>

    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      class="dropdown-menu dropdown-menu-end show p-2 shadow"
      style="width: 300px; right: 0; top: 100%; z-index: 1000;"
    >
      <div class="dropdown-header d-flex justify-content-between align-items-center">
        <span>Notifikasi Terbaru</span>
        <button
          v-if="unreadCount > 0"
          class="btn btn-sm btn-link text-decoration-none"
          @click.stop="markAll"
          style="font-size: 0.8rem;"
        >
          Tandai semua dibaca
        </button>
      </div>

      <div v-if="sortedNotifications.length > 0">
        <div
          v-for="notif in sortedNotifications.slice(0, 5)"
          :key="notif._id"
          @click="markAsRead(notif._id)"
          class="dropdown-item px-2 py-2 rounded mb-1"
          style="cursor: pointer; transition: background 0.2s;"
          @mouseover="hovered = notif._id"
          @mouseleave="hovered = null"
          :style="{ backgroundColor: hovered === notif._id ? '#f8f9fa' : 'transparent' }"
        >
          <div class="fw-semibold" :class="{ 'text-dark': !notif.isRead, 'text-muted': notif.isRead }">
            {{ notif.title }}
          </div>
          <div class="small text-muted text-wrap">
            {{ notif.message }}
          </div>
        </div>
      </div>
      <div v-else class="dropdown-item text-muted">Tidak ada notifikasi</div>
    </div>
  </div>
</template>


<script>
import { onMounted, ref, computed } from 'vue';
import useNotification from '@/modules/notificationCRUD.js';

export default {
  name: 'NotificationBell',
  setup() {
    const showDropdown = ref(false);
    const hovered = ref(null);
    const {
      stateNotification,
      getNotifications,
      markAsRead,
      markAllAsRead 
    } = useNotification();

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };

    const markAll = async () => {
      if (!username) return;
      await markAllAsRead(username);
      stateNotification.notifications.forEach(n => (n.isRead = true));
    };

    const username = sessionStorage.getItem('username');

    onMounted(() => {
      if (username) {
        console.log("🟡 Fetching notifications for:", username); // debug
        getNotifications(username);
      } else {
        console.log("❌ Username not found in sessionStorage");
      }
    });

    const unreadCount = computed(() =>
      stateNotification.notifications.filter(n => !n.isRead).length
    );

    // Show unread notifications first, then the rest by newest
    const sortedNotifications = computed(() => {
      return [...stateNotification.notifications].sort((a, b) => {
        if (a.isRead === b.isRead) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.isRead ? 1 : -1;
      });
    });

    return {
      showDropdown,
      toggleDropdown,
      stateNotification,
      markAsRead,
      unreadCount,
      hovered,
      sortedNotifications,
      markAll,
      markAllAsRead
    };
  }
};
</script>
