import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useUserStore = defineStore(
  "user",
  () => {
    const wasAuthenticatedAtLastCheck = ref(false);
    const lastUpdateTime = ref(new Date(0));
    const milliSecondsSinceLastAuthCheck = ref(Number.MAX_VALUE);

    setInterval(() => {
      // Recalculate the milliseconds since the last API call
      // which confirmed whether the user was authenticated or unauthenticated
      milliSecondsSinceLastAuthCheck.value = Math.abs(new Date().getTime() - lastUpdateTime.value.getTime());
    }, 5000);

    function resetLastUpdateTime() {
      lastUpdateTime.value = new Date();
      milliSecondsSinceLastAuthCheck.value = 0;
    }

    const isAuthenticated = computed(() => {
      // Check on wasAuthenticatedAtLastCheck first, since vue will just reuse the cached computed result
      // if the user is not authenticated instead of constantly recalculating whether the user is still authenticated

      // Authenticated sessions time out after 30 minutes
      return wasAuthenticatedAtLastCheck.value && milliSecondsSinceLastAuthCheck.value / 60000 < 30;
    });

    return {
      isAuthenticated,
      wasAuthenticatedAtLastCheck,
      lastUpdateTime,
      resetLastUpdateTime,
    };
  },
  {
    persist: {
      debug: true,
    },
  }
);