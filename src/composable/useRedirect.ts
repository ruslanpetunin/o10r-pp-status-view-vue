function createHiddenForm(url: string, method: 'GET' | 'POST', data: Record<string, string>): HTMLFormElement {
  const form: HTMLFormElement = document.createElement('form');

  form.method = method;
  form.action = url;

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

export default function() {
  return {
    createHiddenForm,
    createWindow
  }
}
