<template>
  <n-form size="large">
    <n-card
      v-for="(instructionGroup, groupIndex) in recipeStore.recipe.instructionGroups"
      segmented
      :key="instructionGroup.uuid"
      @close="removeInstructionGroup(groupIndex)"
    >
      <template v-slot:header>
        <x-row>
          <x-column col-12 col-md-6>
            <x-input
              path="label"
              label="Section Title (optional)"
              :value="instructionGroup.label"
              @input="handleInstructionGroupTitleChange($event, groupIndex)"
            />
          </x-column>
        </x-row>
      </template>
      <template v-slot:header-extra>
        <n-button :bordered="false" @click="removeInstructionGroup(groupIndex)">
          <x-icon fa-icon="fa-xmark" />
        </n-button>
      </template>
      <recipe-instruction
        v-for="(instruction, instructionIndex) in instructionGroup.instructions"
        :key="instruction.uuid"
        :prefix="instructionIndex + 1 + '.'"
        :label="instruction.label"
        :ref="`instructionGroups${groupIndex}`"
        @input="handleInstructionInputAtIndex($event, groupIndex, instructionIndex)"
      >
        <template v-slot:end>
          <!-- Force top label to be displayed on first row where other item labels are also displayed to keep aligned -->
          <n-form-item :label="instructionIndex === 0 ? ' ' : ''" class="list-item__end">
            <x-icon class="list-item__close" fa-icon="fa-xmark" @click="removeInstructionFromGroup(groupIndex, instructionIndex)" />
          </n-form-item>
        </template>
      </recipe-instruction>
      <!-- Ghost row to create new rows. These components are never used for real data. -->
      <x-row class="ghost">
        <x-column col-11>
          <x-input
            label="Instruction"
            path=""
            value=""
            :prefix="recipeStore.recipe.instructionGroups[groupIndex].instructions.length + 1 + '.'"
            :show-label="instructionGroup.instructions.length === 0"
            :show-error="false"
            @focus="addInstructionToGroup(groupIndex, 'label')"
          />
        </x-column>
      </x-row>
      <x-row class="mobile">
        <n-button type="primary" block tertiary class="editor__add-item" @click="addInstructionToGroup(groupIndex, 'label')"
          >Add instruction</n-button
        >
      </x-row>
    </n-card>
    <n-button class="editor__add-section" type="primary" block tertiary @click="addInstructionGroup">Add instruction section</n-button>
  </n-form>
</template>

<script setup lang="ts">
import { XRow, XColumn, XInput, XIcon } from "@/components";
import { RecipeInstruction } from "@/views/editor/components";
import { NCard, NForm, NButton, NFormItem } from "naive-ui";
import { onMounted } from "vue";
import { useRecipeStore } from "@/store/recipeStore";

const recipeStore = useRecipeStore();

onMounted(() => {
  if (recipeStore.recipe.instructionGroups.length === 0) {
    addInstructionGroup();
  }
});

function handleInstructionGroupTitleChange(value: string, groupIndex: number) {
  recipeStore.recipe.instructionGroups[groupIndex].name = value;
}

function handleInstructionInputAtIndex(value: string, groupIndex: number, instructionIndex: number) {
  recipeStore.recipe.instructionGroups[groupIndex].instructions[instructionIndex].label = value;
}

function addInstructionGroup() {
  recipeStore.recipe.instructionGroups.push({
    name: "",
    instructions: [],
  });
  // Pre-populate a new group with an instruction to indicate what the group is used for
  addInstructionToGroup(recipeStore.recipe.instructionGroups.length - 1);
}

function addInstructionToGroup(groupIndex: number) {
  recipeStore.recipe.instructionGroups[groupIndex].instructions.push({
    label: "",
  });
}

function removeInstructionGroup(groupIndex: number) {
  recipeStore.recipe.instructionGroups.splice(groupIndex, 1);
}

function removeInstructionFromGroup(groupIndex: number, instructionIndex: number) {
  recipeStore.recipe.instructionGroups[groupIndex].instructions.splice(instructionIndex, 1);
}
</script>

<style scoped lang="scss">
@use "@/styles/_mixins" as m;
.n-form {
  display: flex;
  flex-direction: column;
  @include m.spacing("gy", "sm");
}
</style>
