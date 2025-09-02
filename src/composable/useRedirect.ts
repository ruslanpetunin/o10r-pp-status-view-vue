import { ref } from "vue";
import type { RedirectMode } from "./../types/redirect";
import type { Redirect } from "o10r-pp-core";

function createHiddenForm(url: string, method: 'GET' | 'POST', data: Record<string, string>): HTMLFormElement {
  const form: HTMLFormElement = document.createElement('form');

  form.method = method;
  form.action = url;

  if (method === 'GET') {
    const orlObj = new URL(url);

    form.action = orlObj.origin + orlObj.pathname;

    for (const [key, value] of orlObj.searchParams.entries()) {
      if (data[key] === undefined) {
        data[key] = value;
      }
    }
  }

  for (const key of Object.keys(data)) {
    const input = document.createElement('input');

    input.type = 'hidden';
    input.name = key;
    input.value = data[key];

    form.appendChild(input);
  }

  return form;
}

function createWindow() {
  const windowName: string = 'w_' + Date.now() + Math.floor(Math.random() * 100000).toString();
  const features = 'height=550,width=800,channelmode=0,dependent=0,directories=0,fullscreen=0,location=0,menubar=0,resizable=0,scrollbars=0,status=0,toolbar=0';

  return {
    name: windowName,
    newWindow: window.open('', windowName, features)
  };
}

export default function(config: Redirect, mode: RedirectMode) {
  const iframe = ref<HTMLIFrameElement>();
  const runRedirect = ref<() => void>();

  function autoRunRedirect() {
    if (mode !== 'new-window' && runRedirect.value) {
      runRedirect.value();
    }
  }

  if (mode === 'iframe') {
    runRedirect.value = () => {
      const form = createHiddenForm(config.url, config.method, config.body || {});

      if (iframe.value) {
        form.target = iframe.value.name;

        document.body.appendChild(iframe.value);
        document.body.appendChild(form);

        form.submit();
        form.remove();

        runRedirect.value = undefined;
      }
    };
  } else if (mode === 'new-window') {
    runRedirect.value = () => {
      const { name } = createWindow();
      const form = createHiddenForm(config.url, config.method, config.body || {});

      form.target = name;

      document.body.appendChild(form);

      form.submit();
      form.remove();

      runRedirect.value = undefined;
    };
  } else if (mode === 'current-window') {
    runRedirect.value = () => {
      const form = createHiddenForm(config.url, config.method, config.body || {});

      document.body.appendChild(form);

      form.submit();
      form.remove();

      runRedirect.value = undefined;
    };
  }

  return {
    iframe,
    runRedirect,
    autoRunRedirect,
    createHiddenForm
  }
}
