<template>
  <div
    v-if="show"
    data-testid="add-todo-modal"
    class="fixed inset-0 z-50 flex flex-col bg-white animate-in fade-in duration-200 overflow-hidden"
  >
    <div
      class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80 shrink-0"
    >
      <div class="flex items-center gap-2.5">
        <div
          class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center"
        >
          <Plus :size="18" :stroke-width="2.5" />
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-800">Tambah Lelang Baru</h3>
          <p class="text-xs text-slate-600">
            Buat lelang baru dan tuliskan detailnya dengan format Markdown
          </p>
        </div>
      </div>
      <button
        type="button"
        data-testid="close-add-modal-btn"
        class="p-2 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
        @click="onClose"
      >
        <X :size="20" />
      </button>
    </div>

    <form class="flex-1 flex flex-col min-h-0 bg-white" @submit.prevent="handleSave">
      <div class="flex-1 flex flex-col min-h-0 p-6 md:p-8 space-y-4 w-full">
        <div class="shrink-0">
          <label
            for="add-todo-title-input"
            class="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Judul Lelang <span class="text-red-500">*</span>
          </label>
          <input
            id="add-todo-title-input"
            v-model="title"
            type="text"
            data-testid="add-todo-title-input"
            placeholder="Contoh: Lelang Laptop Bekas"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm shadow-xs"
            required
          />
        </div>

        <div class="flex-1 flex flex-col min-h-0">
          <label
            for="add-todo-description-input"
            class="block text-sm font-semibold text-slate-700 mb-1.5 shrink-0"
          >
            Deskripsi (Markdown) <span class="text-red-500">*</span>
          </label>
          <div class="flex-1 min-h-[300px]">
            <MarkdownEditor
              v-model="description"
              placeholder="Tuliskan rincian lelang dalam format Markdown..."
              height="100%"
              textarea-test-id="add-todo-description-input"
            />
          </div>
        </div>
      </div>

      <div
        class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/80 shrink-0"
      >
        <button
          type="button"
          data-testid="cancel-add-modal-btn"
          :disabled="loading"
          class="px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
          @click="onClose"
        >
          Batal
        </button>
        <button
          type="submit"
          data-testid="submit-add-modal-btn"
          :disabled="loading"
          class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-600/25 transition-all disabled:opacity-60"
        >
          <template v-if="loading">
            <Loader2 :size="18" class="animate-spin" />
            <span>Menyimpan...</span>
          </template>
          <template v-else>
            <Plus :size="18" :stroke-width="2.5" />
            <span>Tambah Lelang</span>
          </template>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, defineAsyncComponent } from "vue";
import { Plus, X, Loader2 } from "lucide-vue-next";
import { useAucationsStore } from "../states/aucationsStore";
import { showErrorDialog } from "../../../helpers/toolsHelper";

const MarkdownEditor = defineAsyncComponent(() =>
  import("../components/MarkdownEditor.vue")
);

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);
const aucationsStore = useAucationsStore();

const loading = ref(false);
const title = ref("");
const description = ref("");

function onClose() {
  emit("close");
}

watch(
  () => props.show,
  (newShow) => {
    document.body.style.overflow = newShow ? "hidden" : "auto";
  }
);

watch(
  () => [aucationsStore.isTodoAdd, aucationsStore.isTodoAdded],
  ([isTodoAdd, isTodoAdded]) => {
    if (isTodoAdd) {
      loading.value = false;
      aucationsStore.setIsTodoAdd(false);
      if (isTodoAdded) {
        aucationsStore.setIsTodoAdded(false);
        aucationsStore.asyncSetTodos();
        title.value = "";
        description.value = "";
        onClose();
      }
    }
  }
);

function handleSave() {
  if (!title.value.trim()) {
    showErrorDialog("Judul tidak boleh kosong");
    return;
  }
  if (!description.value.trim()) {
    showErrorDialog("Deskripsi tidak boleh kosong");
    return;
  }
  loading.value = true;
  aucationsStore.asyncSetIsTodoAdd(title.value.trim(), description.value.trim());
}
</script>