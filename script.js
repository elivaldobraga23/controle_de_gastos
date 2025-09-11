function adicionar(){
    // Pegando o input Data e hora
    let dataHora = document.getElementById('data')
    
    let selecionarCategoria = document.getElementById('categoria')

    let valorStr = document.getElementById('valor')

    let selecionarFormaPagamento = document.getElementById('formaP')

    let descricao = document.getElementById('descricao')

    // pegando os Erros
    let erroCategoria = document.getElementById('erro-categoria')
    let erroValor = document.getElementById('erro-valor')
    let erroFormaPagamento = document.getElementById('erro-formaP')

     // Limpar resultados e erros antigos
    erroCategoria.innerHTML = '';
    erroValor.innerHTML = '';
    erroFormaPagamento.innerHTML = '';

    // Variável de erro
    let temErro  = false

    let res = document.getElementById('res')

    // limpando o res
    res.innerHTML = '';

    let resultado = {};

    // Data e Hora
    if (dataHora.value === '') {
        // caso o usuário NÃO escolha → pega a data/hora atual
        let agora = new Date();
        let dia = String(agora.getDate()).padStart(2,'0');
        let mes = String(agora.getMonth()+1).padStart(2,'0');
        let ano = agora.getFullYear();
        let hora = String(agora.getHours()).padStart(2,'0');
        let minuto = String(agora.getMinutes()).padStart(2,'0');

        resultado.dataHora = `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    } else {
        // caso o usuário escolha → usa o valor do input
        let partes = dataHora.value.split('T');
        let data = partes[0].split('-');
        let hora = partes[1];
        resultado.dataHora = `${data[2]}/${data[1]}/${data[0]} ${hora}`;
    }

    // Categoria
    if (selecionarCategoria.value === ""){
        erroCategoria.innerHTML = 'Selecione uma categoria para prosseguir'
        temErro = true
    } else{
        //let texto = select.options[select.selectedIndex].text
        resultado.categoria = selecionarCategoria.options[selecionarCategoria.selectedIndex].text
        
    }

     // Valor
    if (valorStr.value.trim() === '') {
        erroValor.innerHTML = 'Ops! Campo de valor vazio. Digite o valor.'
        temErro = true
    } else {
        let valortxt = valorStr.value.replace(/\./g, '').replace(',', '.');
        let valorNumero = Number(valortxt)

        if (isNaN(valorNumero) || valorNumero <= 0) {
            erroValor.innerHTML = 'Digite um valor válido em R$'
            temErro = true
        } else {
            resultado.valor = valorNumero; // 🔥 valor numérico
            resultado.valorFormatado = valorNumero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    }

    // Forma Pagamento
    if(selecionarFormaPagamento.value === ''){
        erroFormaPagamento.innerHTML = 'Forma de Pagamento não Informada, Por favor selecione uma Forma de Pagamento'
        temErro = true

    } else{
        resultado.formaPagamento = selecionarFormaPagamento.options[selecionarFormaPagamento.selectedIndex].text
    }

    // Descrição
    if(descricao.value.trim() === ''){
        resultado.textoDescricao = 'Sem Descrição'

    } else{
        resultado.textoDescricao = descricao.value
        
    }
    // Só exibir se não tiver erros
    if (!temErro) {
        res.innerHTML = `
            <p>Valores adicionados</p>
            <p>Data / Hora: ${resultado.dataHora}</p>
            <p>Categoria: ${resultado.categoria}</p>
            <p>Valor: ${resultado.valorFormatado}</p>
            <p>Forma de Pagamento: ${resultado.formaPagamento}</p>
            <p>Descrição: ${resultado.textoDescricao}</p>
        `

        // Salvar no localStorage
        // Primeiro pegamos o array existente
        let registros = JSON.parse(localStorage.getItem('registros')) || [];
        
        // Adicionamos o novo registro
        registros.push(resultado);
        
        // Salvamos de volta no localStorage
        localStorage.setItem('registros', JSON.stringify(registros));
        // Limpar os campos do formulário
        dataHora.value = '';
        selecionarCategoria.value = '';
        valorStr.value = '';
        selecionarFormaPagamento.value = '';
        descricao.value = '';
            
    } else{
        res.innerHTML = 'Por Favor adicione todos os valores!'
    }

}

function mostrarRegistros() {
    let mainone = document.querySelector('main#mainone')
    let pagRegistros = document.querySelector('div#pagRegistros')

    mainone.style.display = 'none'
    pagRegistros.style.display = 'block'

    let registros = JSON.parse(localStorage.getItem('registros')) || [];
    let res = document.getElementById('res');

    if (registros.length === 0) {
        res.innerHTML = '<p>Nenhum registro encontrado!</p>';
        return;
    }

    res.innerHTML = '';
    let totalGasto = 0;

    registros.forEach((r, i) => {
        totalGasto += r.valor; // 🔥 soma direto dos registros
        res.innerHTML += `
            <p><strong>Registro ${i + 1}</strong></p>
            <p>Data / Hora: ${r.dataHora}</p>
            <p>Categoria: ${r.categoria}</p>
            <p>Valor: ${r.valorFormatado}</p>
            <p>Forma de Pagamento: ${r.formaPagamento}</p>
            <p>Descrição: ${r.textoDescricao}</p>
            <button id="btnexcluir" onclick="excluirRegistro(${i})"><span class="material-symbols-outlined">
            delete
            </span></button>
            <hr>

        `;
    });

    res.innerHTML += `<p><strong>Valor Total Gasto: ${totalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>`;

    res.innerHTML += '<button id="btnExcluirTodos" onclick="excluirTodosRegistros()"> Excluir Todos os Registros </button>'
}


function excluirRegistro(index) {
    confirmar = confirm('Deseja apagar esse registro?')
    if(confirmar){
        let registros = JSON.parse(localStorage.getItem('registros')) || [];

        // Remover o valor gasto do total também
        let valorRemovido = registros[index].valorFormatado.replace(/[R$\.\s]/g, '').replace(',', '.');
        valorRemovido = Number(valorRemovido);

        let valorGasto = Number(localStorage.getItem('valorGasto')) || 0;
        valorGasto -= valorRemovido;
        localStorage.setItem('valorGasto', valorGasto);

        // Remover o registro do array
        registros.splice(index, 1);

        // Atualizar localStorage
        localStorage.setItem('registros', JSON.stringify(registros));

        // Recarregar lista
        mostrarRegistros();
    }
    }

function excluirTodosRegistros() {
    const confirmar = confirm("Deseja realmente apagar **todos os registros**?");
    if (confirmar) {
        localStorage.removeItem('registros'); // remove todos os registros
        mostrarRegistros(); // Atualiza a página de registros
    }
}




function adicionarMais(){
    let mainone = document.querySelector('main#mainone')
    let pagRegistros = document.querySelector('div#pagRegistros')

    mainone.style.display = 'block'
    pagRegistros.style.display = 'none'

    // Chame mostrarRegistros() quando a página carregar
    window.onload = mostrarRegistros;
    

}

function mostrarTotaisPorCategoria() {
    let registros = JSON.parse(localStorage.getItem('registros')) || [];
    let resCategoria = document.getElementById('resCategoria');
    let mainone = document.querySelector('main#mainone')
    let pagRegistros = document.querySelector('div#pagRegistros')
    mainone.style.display = 'none'
    pagRegistros.style.display = 'none'
    resCategoria.style.display = 'block'

    resCategoria.innerHTML = ''; // Limpa resultados anteriores

    if (registros.length === 0) {
        let html = '<input id="btnVoltar" type="button" value="Voltar ao Inicio" onclick="voltarI()"> <br>'
        let btnVoltarRegistro = '<input id="btnVoltarRegistro" type="button" value="Voltar ao Registro" onclick="voltarReg()">'


        resCategoria.innerHTML = html
        resCategoria.innerHTML += btnVoltarRegistro
        resCategoria.innerHTML += '<p>Nenhum registro encontrado!</p>';
        return;
    
    }

    // Agrupando valores por categoria
    let totais = {};
    registros.forEach(r => {
        if (!totais[r.categoria]) {
            totais[r.categoria] = 0;
        }
        totais[r.categoria] += r.valor;
    });

    // Montando o HTML
    let html = `<input id="btnVoltar" type="button" value="Voltar ao Inicio" onclick="voltarI()"> 
    <input id="btnVoltarRegistro" type="button" value="Voltar ao Registro" onclick="voltarReg()">`
    html += '<h3>Total por Categoria:</h3>';
    for (let categoria in totais) {
        html += `<p style="text-align: start" id="paragcategorias">${categoria}: ${totais[categoria].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        <hr>`;
    }


    resCategoria.innerHTML = html;

}

function voltarI(){
    let resCategoria = document.getElementById('resCategoria');
    let mainone = document.querySelector('main#mainone')
    let pagRegistros = document.querySelector('div#pagRegistros')
    mainone.style.display = 'block'
    pagRegistros.style.display = 'none'
    resCategoria.style.display = 'none'

}

function voltarReg() {
    let resCategoria = document.getElementById('resCategoria');
    let mainone = document.querySelector('main#mainone')
    let pagRegistros = document.querySelector('div#pagRegistros')
    mainone.style.display = 'none'
    pagRegistros.style.display = 'block'
    resCategoria.style.display = 'none'

}

function exportarParaExcel() {
    let registros = JSON.parse(localStorage.getItem('registros')) || [];

    if (registros.length === 0) {
        alert('Nenhum registro para exportar!');
        return;
    }

    // Meses em português
    const nomesMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Agrupar registros por mês (ano-mês)
    const registrosPorMes = {};

    registros.forEach(r => {
        // Parse manual da data "dd/mm/yyyy hh:mm"
        let partes = r.dataHora.split(/[\s/:]/); 
        let dia = parseInt(partes[0], 10);
        let mes = parseInt(partes[1], 10) - 1; // JS 0-index
        let ano = parseInt(partes[2], 10);
        let hora = parseInt(partes[3], 10) || 0;
        let minuto = parseInt(partes[4], 10) || 0;

        let data = new Date(ano, mes, dia, hora, minuto);

        let chave = `${ano}-${mes + 1}`;
        if (!registrosPorMes[chave]) registrosPorMes[chave] = [];
        registrosPorMes[chave].push(r);
    });

    for (const chave in registrosPorMes) {
        const [ano, mesNum] = chave.split("-");
        const nomeMes = nomesMeses[parseInt(mesNum, 10) - 1];

        const dados = registrosPorMes[chave].map((r, i) => ({
            "Registro": i + 1,
            "Data / Hora": r.dataHora,
            "Categoria": r.categoria,
            "Valor": r.valor,
            "Forma de Pagamento": r.formaPagamento,
            "Descrição": r.textoDescricao
        }));

        // Criar workbook e planilha
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dados);

        // Ajustar largura das colunas
        ws['!cols'] = [
            { wch: 10 },
            { wch: 20 },
            { wch: 20 },
            { wch: 15 },
            { wch: 20 },
            { wch: 50 }
        ];

        // Calcular total geral e por categoria
        let totalGasto = 0;
        const totalPorCategoria = {};

        registrosPorMes[chave].forEach(r => {
            totalGasto += r.valor;
            totalPorCategoria[r.categoria] = (totalPorCategoria[r.categoria] || 0) + r.valor;
        });

        // Adicionar totais na planilha
        const ultimaLinha = dados.length + 2;
        XLSX.utils.sheet_add_aoa(ws, [[""]], { origin: `A${ultimaLinha}` });
        XLSX.utils.sheet_add_aoa(ws, [["Total Gasto:", totalGasto]], { origin: `A${ultimaLinha + 1}` });

        let linhaCategoria = ultimaLinha + 3;
        for (const cat in totalPorCategoria) {
            XLSX.utils.sheet_add_aoa(ws, [[`Total ${cat}:`, totalPorCategoria[cat]]], { origin: `A${linhaCategoria}` });
            linhaCategoria++;
        }

        // Adicionar planilha ao workbook
        XLSX.utils.book_append_sheet(wb, ws, nomeMes);

        // Salvar arquivo com nome do mês
        let nomeArquivo = `Registros_${nomeMes}_${ano}.xlsx`;
        XLSX.writeFile(wb, nomeArquivo);
    }
}





