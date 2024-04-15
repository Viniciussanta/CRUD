const readline = require('readline');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017/bancodedados';

mongoose.connect(url)
    .then(() => console.log('Conectado ao MongoDB.'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

app.use(express.json());

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const listaSchema = new mongoose.Schema({
    nome: { type: String },
    descricao: { type: String},
    telefone: { type: Number },
    email: { type: String }
});

const ListaTelefonica = mongoose.model("ListaTelefonica", listaSchema);

function exibirMenu() {
    console.log('\n===== Menu =====');
    console.log('1. Inserir registro');
    console.log('2. Atualizar registro');
    console.log('3. Excluir registro');
    console.log('4. Visualizar registros');
    console.log('0. Sair');
}

function menu() {
    
    exibirMenu();
    rl.question('Escolha uma opção: ', (opcao) => {
        switch (opcao) {
            case '1':
                inserirRegistro();
                break;
            case '2':1
                atualizarRegistro();
                break;
            case '3':
                excluirRegistro();
                break;
            case '4':
                visualizarRegistros();
                break;
            case '0':
                rl.close(); 
                return;
            default:
                console.log('Opção inválida! Por favor, escolha uma opção válida.');
        }
    });
}


rl.on('close', () => {
    console.log('Saindo do programa.');
    process.exit(0); 
});

async function inserirRegistro() {
    try {
        rl.question('Nome: ', async (nome) => {
            rl.question('Descrição: ', async (descricao) => {
                rl.question('Telefone: ', async (telefone) => {
                    rl.question('Email: ', async (email) => {
                        try {
                            const novaLista = new ListaTelefonica({ nome, descricao, telefone, email });
                            const listaSalva = await novaLista.save();
                            console.log('Registro inserido com sucesso:', listaSalva);
                        } catch (error) {
                            console.error('Erro ao inserir registro:', error);
                        } finally {
                            menu();
                        }
                    });
                });
            });
        });
    } catch (error) {
        console.error('Erro ao inserir registro:', error);
    }
}

async function atualizarRegistro() {
    try {
        rl.question('ID do registro a ser atualizado: ', async (id) => {
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                console.log('ID inválido.');
                menu();
                return;
            }

            
            rl.question('Novo nome: ', async (novoNome) => {
                rl.question('Nova descrição: ', async (novaDescricao) => {
                    rl.question('Novo telefone: ', async (novoTelefone) => {
                        rl.question('Novo email: ', async (novoEmail) => {
                            try {
                                
                                const registro = await ListaTelefonica.findById(id);
                                if (!registro) {
                                    console.log('Registro não encontrado.');
                                    menu();
                                    return;
                                }

                            
                                registro.nome = novoNome;
                                registro.descricao = novaDescricao;
                                registro.telefone = novoTelefone;
                                registro.email = novoEmail;

                               
                                const registroAtualizado = await registro.save();
                                console.log('Registro atualizado com sucesso:', registroAtualizado);
                            } catch (error) {
                                console.error('Erro ao atualizar registro:', error);
                            } finally {
                                menu();
                            }
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Erro ao atualizar registro:', error);
    }
}

async function excluirRegistro() {
    rl.question('Telefone do registro a ser excluído: ', async (telefone) => {
        try {
            const registro = await ListaTelefonica.findOneAndDelete({ telefone: telefone });
            if (registro) {
                console.log('Registro excluído com sucesso:', registro);
            } else {
                console.log('Registro não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao excluir registro:', error);
        } finally {
            menu(); 
        }
    });
}

async function visualizarRegistros() {
    try {
        const registros = await ListaTelefonica.find();
        if (registros.length > 0) {
            console.log('Registros encontrados:');
            registros.forEach(registro => {
                console.log(registro);
            });
        } else {
            console.log('Nenhum registro encontrado.');
        }
    } catch (error) {
        console.error('Erro ao visualizar registros:', error);
    } finally {
        menu(); 
    }
}

app.listen(port, () => {
    
    menu();
});
