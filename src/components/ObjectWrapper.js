import { toString } from "../util";
import { useExpand } from "../hooks";

export default {
  name: "object-wrapper",
  props: {
    path: {
      required: true,
      validator(path) {
        return (
          toString(path) === "Array" &&
          path.every((key) => toString(key) === "String")
        );
      },
    },
    data: {
      required: true,
      validator(data) {
        return toString(data) === "Object";
      },
    },
    name: {
      required: true,
      type: String,
    },
    collapseSignal: {
      default: false,
      type: Boolean,
    },
    expandSignal: {
      default: false,
      type: Boolean,
    },
    expandOnCreatedAndUpdated: {
      required: true,
      type: Function,
    },
    ignore: {
      required: true,
      type: Function,
    },
  },
  setup(props) {
    const {
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
    } = useExpand(props);

    return {
      isExpanding,
      innerExpandSignal,
      innerCollapseSignal,
      handleClick,
    };
  },
  components: {
    // Wrapper,
  },
  template: `
    <span class="object">
      <span
        class="indicator"
        @click="handleClick"
      >{{ isExpanding ? '\u25BC' : '\u25B6' }}</span>
      <span
        class="key"
        @click="handleClick"
      >{{ name === '' ? '' : name }}</span>
      <span
        class="separator"
        @click="handleClick"
      >
        {{ name === '' ? '' : ': ' }}
      </span>
      <span
        class="preview"
        @click="handleClick"
      >
        {{ isExpanding ? '' : '{...}' }}
      </span>

      <span v-show="isExpanding" class="value">
        <template
          v-for="key of Object.keys(data).sort()"
        >
          <wrapper
            v-if="ignore(path) === false"
            class="value"
            :name="key"
            :path="path.concat(key)"
            :data="data[key]"
            :expand-signal="innerExpandSignal"
            :collapse-signal="innerCollapseSignal"
            :ignore="ignore"
            :expandOnCreatedAndUpdated="expandOnCreatedAndUpdated"
          ></wrapper>
        </template>
      </span>
    </span>
  `,
};
