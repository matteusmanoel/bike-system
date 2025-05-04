document.addEventListener("DOMContentLoaded", () => {
    renderizarCarrinho();
});

function renderizarCarrinho() {
    const container = document.getElementById("carrinhoContainer");
    const totalEl = document.getElementById("total");
    container.innerHTML = "";

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let total = 0;

    if (carrinho.length === 0) {
        container.innerHTML = "<p>Carrinho vazio.</p>";
        totalEl.innerHTML = `<div class="total-carrinho"><p><strong>Total:</strong> R$ <span>0,00</span></p></div>`;
        return;
    }

    carrinho.forEach((produto, index) => {
        const subtotal = produto.preco * produto.quantidade;
        total += subtotal;

        const card = document.createElement("div");
        card.className = "produto-card";
        card.innerHTML = `
            <img src="${produto.imagem || "../images/sem-imagem.png"}" class="produto-img" alt="${produto.descricao}" />
            <h3>${produto.descricao}</h3>
            <p>R$ ${produto.preco.toFixed(2)}</p>
            <div>
                <button onclick="alterarQuantidade(${index}, -1)">➖</button>
                ${produto.quantidade}
                <button onclick="alterarQuantidade(${index}, 1)">➕</button>
            </div>
            <p><strong>Subtotal:</strong></p>
            <p><strong>R$ ${subtotal.toFixed(2)}</strong></p>
            <button onclick="removerProduto(${index})">Remover</button>
        `;
        container.appendChild(card);
    });

    totalEl.innerHTML = `
        <div class="total-carrinho">
            <p><strong>Total:</strong> R$ <span>${total.toFixed(2).replace('.', ',')}</span></p>
        </div>
    `;
}

function alterarQuantidade(index, delta) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho[index].quantidade += delta;

    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderizarCarrinho();
}

function removerProduto(index) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.splice(index, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    renderizarCarrinho();
}

function voltar() {
    window.location.href = "listagem.html";
}

function finalizarCompra() {
    const vendedor = prompt("Nome do vendedor(a):");
    if (!vendedor) return;

    const pagamento = prompt("Forma de pagamento (ex: Pix, Cartão, Dinheiro):");
    if (!pagamento) return;

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const estoque = JSON.parse(localStorage.getItem("estoque")) || [];
    const dataAtual = new Date().toLocaleDateString("pt-BR");

    carrinho.forEach(produto => {
        estoque.push({
            data: dataAtual,
            nome: produto.descricao,
            descricao: `Categoria: ${produto.categoria}, Fabricante: ${produto.fabricante}`,
            vendedor,
            pagamento,
            quantidade: produto.quantidade,
            preco: produto.preco
        });
    });

    localStorage.setItem("estoque", JSON.stringify(estoque));
    localStorage.removeItem("carrinho");
    alert("Compra registrada com sucesso!");
    window.location.href = "estoque.html";
}

function limparCarrinho() {
    if (confirm("Tem certeza que deseja limpar o carrinho?")) {
        localStorage.removeItem("carrinho");
        renderizarCarrinho();
        alert("Carrinho limpo com sucesso!");
    }
}
