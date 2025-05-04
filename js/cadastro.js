document.getElementById("produtoForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const descricao = document.getElementById("descricao").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const custo = parseFloat(document.getElementById("custo").value);
    const fabricante = document.getElementById("fabricante").value;
    const categoria = document.getElementById("categoria").value;
    const imagemInput = document.getElementById("imagem");

    const novoProduto = {
        id: Date.now(),
        descricao,
        preco,
        custo,
        fabricante,
        categoria,
        imagem: "../images/sem-imagem.png" // valor padrão
    };

    if (imagemInput.files.length > 0) {
        const reader = new FileReader();

        reader.onload = function () {
            novoProduto.imagem = reader.result;
            salvarProduto(novoProduto);
        };

        reader.readAsDataURL(imagemInput.files[0]);
    } else {
        salvarProduto(novoProduto); // salva com a imagem padrão
    }
});

function salvarProduto(produto) {
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    produtos.push(produto);
    localStorage.setItem("produtos", JSON.stringify(produtos));

    alert("Produto cadastrado com sucesso!");
    document.getElementById("produtoForm").reset();
}
