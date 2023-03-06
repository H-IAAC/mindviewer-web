import html2canvas from "html2canvas";

/*
  getScreenShot: Função que captura um screenshot do gráfico atual
*/
const getScreenshot = (id: string, title: string) => {
  const element: HTMLElement | null = document.querySelector(`#${id}`);
  if (element !== null)
    html2canvas(element).then((canvas) => {
        canvas.toBlob(blob => {
          const anchor = window.document.createElement('a');
          anchor.href = window.URL.createObjectURL(blob);
          anchor.download = `${title}.jpg`;
          anchor.click();
          window.URL.revokeObjectURL(anchor.href);
        },
        'image/jpeg',
        1
        )
    });
}

export default getScreenshot;