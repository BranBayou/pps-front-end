import { createRouter, createWebHistory } from 'vue-router';
import StartScreen from '@/components/StartScreen.vue';
import WorkflowHomeView from '@/Views/workflow/WorkflowHomeView.vue';
import ScanToteView from '@/Views/workflow/ScanToteView.vue';
import PickingView from '@/Views/workflow/PickingView.vue';
import CompleteView from '@/Views/workflow/CompleteView.vue';
import PackingStartView from '@/Views/workflow/PackingStartView.vue';
import PackingView from '@/Views/workflow/PackingView.vue';
import ErrorView from '@/Views/workflow/ErrorView.vue';
import { usePickingStore } from '@/Stores/pickingStore';

const ensurePickListLoaded = (pickingStore) => {
  if (pickingStore.pickList.orders.length === 0) {
    pickingStore.loadPickListFromLocalStorage();
  }
};

const isPickingReady = (pickingStore) => {
  return (
    pickingStore.pickList.orders.length > 0 &&
    Boolean(pickingStore.pickList.selectedTote?.id)
  );
};

const isPickingComplete = (pickingStore) => {
  return pickingStore.pickList.orders.length > 0 &&
    pickingStore.pickList.orders.every((item) => item.isPicked);
};

const routes = [
  {
    path: '/',
    component: StartScreen,
    children: [
      {
        path: '',
        name: 'WorkflowHome',
        component: WorkflowHomeView,
      },
      {
        path: 'scan',
        name: 'ScanTote',
        component: ScanToteView,
      },
      {
        path: 'picking',
        name: 'Picking',
        component: PickingView,
        beforeEnter: () => {
          const pickingStore = usePickingStore();
          ensurePickListLoaded(pickingStore);
          if (!isPickingReady(pickingStore)) {
            return { name: 'ScanTote' };
          }
          return true;
        },
      },
      {
        path: 'picking-complete',
        name: 'PickingComplete',
        component: CompleteView,
        beforeEnter: () => {
          const pickingStore = usePickingStore();
          ensurePickListLoaded(pickingStore);
          if (!isPickingReady(pickingStore)) {
            return { name: 'ScanTote' };
          }
          if (!isPickingComplete(pickingStore)) {
            return { name: 'Picking' };
          }
          return true;
        },
      },
      {
        path: 'packing-start',
        name: 'PackingStart',
        component: PackingStartView,
        beforeEnter: () => {
          const pickingStore = usePickingStore();
          ensurePickListLoaded(pickingStore);
          if (!isPickingReady(pickingStore)) {
            return { name: 'ScanTote' };
          }
          if (!isPickingComplete(pickingStore)) {
            return { name: 'Picking' };
          }
          return true;
        },
      },
      {
        path: 'packing',
        name: 'Packing',
        component: PackingView,
        beforeEnter: () => {
          const pickingStore = usePickingStore();
          ensurePickListLoaded(pickingStore);
          if (!isPickingReady(pickingStore)) {
            return { name: 'ScanTote' };
          }
          if (!isPickingComplete(pickingStore)) {
            return { name: 'Picking' };
          }
          return true;
        },
      },
      {
        path: 'error',
        name: 'WorkflowError',
        component: ErrorView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;