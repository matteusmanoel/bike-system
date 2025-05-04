document.addEventListener("DOMContentLoaded", () => {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    if (produtos.length === 0) {
        document.getElementById("produtosContainer").innerHTML = "<p>Nenhum produto cadastrado.</p>";
        return;
    }

    renderizarProdutos(produtos); // Apenas essa chamada é suficiente
});


function adicionarAoCarrinho(idProduto) {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const produtoSelecionado = produtos.find(p => p.id === idProduto);
    if (!produtoSelecionado) return;

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    const existente = carrinho.find(p => p.id === idProduto);
    if (existente) {
        existente.quantidade += 1;
    } else {
        carrinho.push({ ...produtoSelecionado, quantidade: 1 });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Produto adicionado ao carrinho!");
}

function filtrarProdutos() {
    const termo = document.getElementById("buscaProduto").value.toLowerCase();
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const filtrados = produtos.filter(p => p.descricao.toLowerCase().includes(termo));
    renderizarProdutos(filtrados);
}

function removerProduto(id) {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const atualizado = produtos.filter(produto => produto.id !== parseInt(id));

    if (confirm("Deseja realmente remover este produto?")) {
        localStorage.setItem("produtos", JSON.stringify(atualizado));
        filtrarProdutos(); // ou renderizarProdutos(atualizado);
    }
}

function aplicarFiltro() {
    const termo = document.getElementById("buscaProduto").value.toLowerCase().trim();
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const container = document.getElementById("produtosContainer");
    const mensagem = document.getElementById("mensagemBusca");

    const filtrados = produtos.filter(p =>
        p.descricao.toLowerCase().includes(termo)
    );

    if (filtrados.length === 0) {
        container.innerHTML = "";
        mensagem.textContent = "Nenhum resultado encontrado.";
    } else {
        mensagem.textContent = "";
        renderizarProdutos(filtrados);
    }
}

document.getElementById("buscaProduto").addEventListener("keyup", function (e) {
    if (e.key === "Enter") aplicarFiltro();
});

function renderizarProdutos(produtos) {
    const container = document.getElementById("produtosContainer");
    container.innerHTML = ""; // limpa os produtos antes de renderizar

    if (produtos.length === 0) {
        container.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

    produtos.forEach((produto) => {
        const card = document.createElement("div");
        card.className = "produto-card";
        card.innerHTML = `
        <button class="btn-remover" onclick="removerProduto('${produto.id}')">✖</button>
        <img src="${produto.imagem || "../images/sem-imagem.png"}" alt="${produto.descricao}" class="produto-img">
        <h3>${produto.descricao}</h3>
        <p><strong>R$ ${produto.preco.toFixed(2)}</strong></p>
        <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
        `;
        container.appendChild(card);
    });
}
