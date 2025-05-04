document.addEventListener("DOMContentLoaded", () => {
    renderizarTabela();
});

function renderizarTabela(filtrado = null) {
    const vendas = filtrado || JSON.parse(localStorage.getItem("estoque")) || [];
    const tbody = document.querySelector("#tabelaEstoque tbody");
    tbody.innerHTML = "";

    if (vendas.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6'>Nenhuma venda registrada.</td></tr>";
        return;
    }

    let totalQtd = 0;
    let totalValor = 0;

    vendas.forEach(venda => {
        const quantidade = Number(venda.quantidade);
        const preco = Number(venda.preco || 0);
        const subtotal = quantidade * preco;

        totalQtd += quantidade;
        totalValor += subtotal;

        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${venda.data}</td>
      <td>${venda.nome}</td>
      <td>${venda.descricao}</td>
      <td>${venda.vendedor}</td>
      <td>${venda.pagamento}</td>
      <td>${quantidade}</td>
    `;
        tbody.appendChild(row);
    });

    const totalRow = document.createElement("tr");
    totalRow.style.fontWeight = "bold";
    totalRow.style.backgroundColor = "#e9f5ff";
    totalRow.innerHTML = `
    <td colspan="5" style="text-align: right;">TOTAL DE ITENS:</td>
    <td>${totalQtd}</td>
  `;
    tbody.appendChild(totalRow);

    const valorRow = document.createElement("tr");
    valorRow.style.fontWeight = "bold";
    valorRow.style.backgroundColor = "#d4f4e5";
    valorRow.innerHTML = `
    <td colspan="5" style="text-align: right;">VALOR TOTAL (R$):</td>
    <td>${totalValor.toFixed(2).replace(".", ",")}</td>
  `;
    tbody.appendChild(valorRow);

    window.vendasFiltradas = vendas;
}


function aplicarFiltro() {
    const dataInicio = document.getElementById("filtroDataInicio").value;
    const dataFim = document.getElementById("filtroDataFim").value;
    const vendedor = document.getElementById("filtroVendedor").value.toLowerCase();

    let vendas = JSON.parse(localStorage.getItem("estoque")) || [];

    if (dataInicio)
        vendas = vendas.filter(v => compararData(v.data) >= compararData(dataInicio));
    if (dataFim)
        vendas = vendas.filter(v => compararData(v.data) <= compararData(dataFim));
    if (vendedor)
        vendas = vendas.filter(v => v.vendedor.toLowerCase().includes(vendedor));

    renderizarTabela(vendas);
}

function limparFiltro() {
    document.getElementById("filtroDataInicio").value = "";
    document.getElementById("filtroDataFim").value = "";
    document.getElementById("filtroVendedor").value = "";
    renderizarTabela();
}

function compararData(dataBR) {
    const [dia, mes, ano] = dataBR.includes("/") ? dataBR.split("/") : dataBR.split("-").reverse();
    return new Date(`${ano}-${mes}-${dia}`);
}

function exportarCSV() {
    const vendas = window.vendasFiltradas || JSON.parse(localStorage.getItem("estoque")) || [];
    if (vendas.length === 0) {
        alert("Não há vendas registradas para exportar.");
        return;
    }

    const cabecalho = ["Data", "Item", "Descrição", "Vendedor(a)", "Forma de Pagamento", "Quantidade", "Valor Total"];
    let csv = cabecalho.join(";") + "\n";

    let totalQuantidade = 0;
    let totalValor = 0;

    vendas.forEach(v => {
        const quantidade = Number(v.quantidade);
        const valorUnitario = Number(v.preco || 0); // caso queira adicionar isso depois
        const subtotal = valorUnitario * quantidade;

        totalQuantidade += quantidade;
        totalValor += subtotal;

        const linha = [
            v.data,
            v.nome,
            v.descricao?.replace(/;/g, " "),
            v.vendedor,
            v.pagamento,
            quantidade,
            subtotal.toFixed(2).replace(".", ",")
        ];

        csv += linha.join(";") + "\n";
    });

    // Adiciona linha de total no final
    csv += `;;;;TOTAL;${totalQuantidade};${totalValor.toFixed(2).replace(".", ",")}\n`;

    // UTF-8 BOM para acentos corretos
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio_vendas.csv";
    a.click();
    URL.revokeObjectURL(url);
}

function voltar() {
    window.location.href = "cadastro.html";
}

function limparEstoque() {
    if (confirm("Tem certeza que deseja limpar o estoque?")) {
        localStorage.removeItem("estoque");
        renderizarTabela([]);
        alert("Estoque limpo com sucesso!");

        location.reload();
    }
}
