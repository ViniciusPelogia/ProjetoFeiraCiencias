import React, { useEffect, useState } from 'react'; // Importa hooks do React
import { BsEmojiSmile, BsEmojiNeutral, BsEmojiFrown } from "react-icons/bs"; // Importa ícones para emojis
import { useParams } from 'react-router-dom'; // Hook para acessar parâmetros da rota
import axios from 'axios'; // Importa axios para requisições HTTP

const Avaliacoes = () => {
    const { id } = useParams(); // Obtém o ID do projeto da URL
    const [votos, setVotos] = useState({ positivos: 0, neutros: 0, negativos: 0 }); // Estado para armazenar contagem de votos
    const [comentarios, setComentarios] = useState([]); // Estado para armazenar comentários
    const [expandedCommentIndex, setExpandedCommentIndex] = useState(null); // Estado para controlar qual comentário está expandido

    useEffect(() => {
        // Função para buscar votos e comentários
        const fetchVotos = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/votos/${id}`); // Faz requisição para buscar votos
                const avaliacoes = response.data; // Obtém dados da resposta
                const positivos = avaliacoes.filter(avaliacao => avaliacao.nota === 'bom').length; // Conta votos positivos
                const neutros = avaliacoes.filter(avaliacao => avaliacao.nota === 'médio').length; // Conta votos neutros
                const negativos = avaliacoes.filter(avaliacao => avaliacao.nota === 'ruim').length; // Conta votos negativos
                const total = positivos + neutros + negativos; // Total de votos

                // Atualiza estado com porcentagens de votos
                setVotos({
                    positivos: (total > 0) ? (positivos / total) * 100 : 0,
                    neutros: (total > 0) ? (neutros / total) * 100 : 0,
                    negativos: (total > 0) ? (negativos / total) * 100 : 0,
                    totalPositivos: positivos,
                    totalNeutros: neutros,
                    totalNegativos: negativos
                });

                // Filtra comentários não vazios
                const comentariosFiltrados = avaliacoes
                    .map(avaliacao => avaliacao.comentario)
                    .filter(comentario => comentario && comentario.trim() !== '');
                setComentarios(comentariosFiltrados); // Atualiza estado com comentários filtrados
            } catch (error) {
                console.error('Erro ao buscar os votos:', error); // Log de erro
            }
        };

        fetchVotos(); // Chama a função para buscar dados
    }, [id]); // Dependência para executar sempre que o ID mudar

    const toggleExpandComment = (index) => {
        // Se o índice clicado for o mesmo que o estado atual, fecha o comentário, caso contrário, expande o novo
        setExpandedCommentIndex(prevIndex => (prevIndex === index ? null : index));
    };

    return (
        <div className="p-4 rounded-lg bg-green-50">
            <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold text-black">Votos</span>
                <div className="flex space-x-2">
                    <span className="flex items-center text-green-600" aria-label={`${votos.totalPositivos} votos positivos`}>
                        <BsEmojiSmile className="w-5 h-5 mr-1" />
                        {votos.totalPositivos} {/* Mostra total de votos positivos */}
                    </span>
                    <span className="flex items-center text-gray-600" aria-label={`${votos.totalNeutros} votos neutros`}>
                        <BsEmojiNeutral className="w-5 h-5 mr-1" />
                        {votos.totalNeutros} {/* Mostra total de votos neutros */}
                    </span>
                    <span className="flex items-center text-red-600" aria-label={`${votos.totalNegativos} votos negativos`}>
                        <BsEmojiFrown className="w-5 h-5 mr-1" />
                        {votos.totalNegativos} {/* Mostra total de votos negativos */}
                    </span>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-xl text-green-500">
                    <BsEmojiSmile />
                </span>
                <div className="w-full h-4 bg-gray-200 rounded-full">
                    <div className="flex h-4 overflow-hidden rounded-full">
                        <div className="bg-green-500" role="progressbar" style={{ width: `${votos.positivos}%` }} aria-valuenow={votos.positivos}
                            aria-valuemin="0" aria-valuemax="100"></div>
                        <div className="bg-gray-500" role="progressbar" style={{ width: `${votos.neutros}%` }} aria-valuenow={votos.neutros}
                            aria-valuemin="0" aria-valuemax="100"></div>
                        <div className="bg-red-500" role="progressbar" style={{ width: `${votos.negativos}%` }} aria-valuenow={votos.negativos}
                            aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>
                <span className="text-xl text-red-500">
                    <BsEmojiFrown />
                </span>
            </div>

            <h1 className="pt-20 text-3xl font-bold text-black dark:text-white">Comentários</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 w-vw">
                {comentarios.map((comentario, index) => {
                    const isLongComment = comentario.length > 100; // Altere o limite conforme necessário
                    const isExpanded = expandedCommentIndex === index; // Verifica se o comentário está expandido

                    return (
                        <div key={index} className="flex flex-grow p-4 mt-4 border border-gray-300 rounded-md bg-green-50 shadow">
                            <div className={`flex-grow max-w-full ${isExpanded ? '' : 'overflow-hidden text-ellipsis whitespace-nowrap'}`}>
                                {comentario}
                            </div>
                            {isLongComment && (
                                <button
                                    onClick={() => toggleExpandComment(index)}
                                    className="ml-2 text-blue-500 hover:underline focus:ring-gray-200"
                                >
                                    {isExpanded ? 'Mostrar menos' : 'Mostrar mais'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default Avaliacoes; // Exporta o componente Avaliacoes
