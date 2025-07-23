import { computed, ref } from 'vue'
import type { FormValidationResult } from 'orchestrator-pp-payment-method';
import type { Translate } from 'orchestrator-pp-core';

function isPPInputType(type: string): type is 'text' | 'number' | 'email' | 'password' | 'tel' {
  return ['text', 'number', 'email', 'password', 'tel'].includes(type);
}

export default function(translate: Translate) {
  const submitted = ref<boolean>(false);
  const touched = ref<string[]>([]);

  const formRef = ref<HTMLFormElement>();
  const formValidationResult = ref<FormValidationResult>({ isValid: false, errors: {} });

  const validationErrors = computed<Record<string, string>>(
    () => {
      const result: Record<string, string> = {};

      if (!formValidationResult.value.isValid) {
        for (const fieldName of Object.keys(formValidationResult.value.errors)) {
          const errors = formValidationResult.value.errors[fieldName];

          if (errors && touched.value.includes(fieldName)) {
            const firstErrorRuleName = Object.keys(errors)[0];

            result[fieldName] = translate(
              `ve_${firstErrorRuleName}`,
              {
                name: translate(`l_${fieldName}`)
              }
            );
          }
        }
      }

      return result;
    }
  );

  return {
    formRef,
    submitted,
    touched,
    formValidationResult,
    validationErrors,

    isPPInputType
  };
}
