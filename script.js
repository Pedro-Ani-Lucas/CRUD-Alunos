const API = "https://proweb.leoproti.com.br"; // troque aqui!

document.addEventListener("DOMContentLoaded", carregarAlunos);

const form = document.getElementById("formAluno");

// ============================
// LISTAR ALUNOS
// ============================
async function carregarAlunos() {
    const resposta = await fetch(`${API}/alunos`);
    const dados = await resposta.json();

    const tabela = document.getElementById("tabelaAlunos");
    tabela.innerHTML = "";

    dados.forEach(aluno => {
        tabela.innerHTML += `
            <tr>
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.turma}</td>
                <td>${aluno.curso}</td>
                <td>${aluno.matricula}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="abrirModal(${aluno.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deletarAluno(${aluno.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

// ============================
// CRIAR NOVO ALUNO
// ============================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const aluno = {
        nome: nome.value,
        turma: turma.value,
        curso: curso.value,
        matricula: matricula.value
    };

    const resp = await fetch(`${API}/alunos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aluno)
    });

    if (resp.ok) {
        form.reset();
        carregarAlunos();
    } else {
        alert("Erro ao cadastrar aluno");
    }
});

// ============================
// ABRIR MODAL PARA EDITAR
// ============================
async function abrirModal(id) {
    const res = await fetch(`${API}/alunos/${id}`);
    const aluno = await res.json();

    document.getElementById("edit-id").value = aluno.id;
    document.getElementById("edit-nome").value = aluno.nome;
    document.getElementById("edit-turma").value = aluno.turma;
    document.getElementById("edit-curso").value = aluno.curso;
    document.getElementById("edit-matricula").value = aluno.matricula;

    const modal = new bootstrap.Modal(document.getElementById("modalEditar"));
    modal.show();
}

// ============================
// SALVAR ALTERAÇÃO (PUT)
// ============================
async function salvarEdicao() {
    const id = document.getElementById("edit-id").value;

    const alunoAtualizado = {
        nome: document.getElementById("edit-nome").value,
        turma: document.getElementById("edit-turma").value,
        curso: document.getElementById("edit-curso").value,
        matricula: document.getElementById("edit-matricula").value
    };

    const resp = await fetch(`${API}/alunos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alunoAtualizado)
    });

    if (resp.ok) {
        carregarAlunos();
        bootstrap.Modal.getInstance(document.getElementById("modalEditar")).hide();
    } else {
        alert("Erro ao atualizar aluno");
    }
}

// ============================
// DELETAR ALUNO
// ============================
async function deletarAluno(id) {
    if (!confirm("Deseja excluir este aluno?")) return;

    const resp = await fetch(`${API}/alunos/${id}`, { method: "DELETE" });

    if (resp.ok) {
        carregarAlunos();
    } else {
        alert("Erro ao excluir aluno");
    }
}
