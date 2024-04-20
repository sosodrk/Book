const url = './Portfolio_2024.pdf';  // Assurez-vous que le chemin est correct

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 1.5,  // Ajustez ceci selon les besoins de taille
      canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');

canvas.id = 'pdf-render';
document.getElementById('pdf-viewer').appendChild(canvas);

// Charge et dessine le PDF
function renderPage(num) {
    pageIsRendering = true;

    // Récupère la page
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport: viewport
        };

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });
    });
}

// Charge le document PDF
pdfjsLib.getDocument(url).promise.then((pdfDoc_) => {
    pdfDoc = pdfDoc_;
    renderPage(pageNum);
}).catch(function(error) {
    console.error('Error: ' + error.message);
});
