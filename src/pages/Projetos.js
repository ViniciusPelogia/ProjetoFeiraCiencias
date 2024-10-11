import React, { useState, useEffect } from "react"; // Importa React e hooks
import axios from "axios"; // Importa axios para realizar requisições HTTP
import Modal from "../components/modal"; // Importa o componente Modal
import AddIcon from "../assets/img/addicon.svg"; // Importa o ícone para adicionar
import ModalAdicionar from "../components/ModalAdicionar"; // Importa o componente de adição de projeto

function Projetos({ listaProjetos }) { // Define o componente Projetos
  // State para controlar a abertura dos modais e outros estados
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projetos, setProjetos] = useState([]); // Lista de projetos
  const [turmas, setTurmas] = useState([]); // Lista de turmas
  const [categorias, setCategorias] = useState([]); // Lista de categorias
  const [selectedCategories, setSelectedCategories] = useState([]); // Categorias selecionadas
  const [selectedClasses, setSelectedClasses] = useState([]); // Turmas selecionadas
  const [searchTerm, setSearchTerm] = useState(""); // Termo de busca

  // Função para alternar a visibilidade do modal
  const toggleModal = (projectId = null) => {
    console.log("Toggling modal for project ID:", projectId);
    setSelectedProjectId(projectId);
    setIsOpen(!isOpen); // Alterna o estado do modal
  };

  // Função para alternar o modal de adição
  const toggleAddModal = () => {
    setIsAddModalOpen(!isAddModalOpen);
  };

  // Função para buscar projetos com base no termo de busca
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:5000/projetos/nome/${searchTerm}` // Faz uma requisição para buscar projetos
      );
      setProjetos(response.data); // Atualiza a lista de projetos
      if (searchTerm == " ") { // Se o termo de busca for espaço, recarrega a página
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao buscar projetos:", error);
    }
  };

  // useEffect para buscar turmas, categorias e projetos ao montar o componente
  useEffect(() => {
    axios
      .get("http://localhost:5000/turmas") // Busca as turmas
      .then((response) => {
        setTurmas(response.data); // Atualiza o estado com as turmas
      })
      .catch((error) => {
        console.error("Erro ao buscar turmas:", error);
      });

    axios
      .get("http://localhost:5000/categorias") // Busca as categorias
      .then((response) => {
        setCategorias(response.data); // Atualiza o estado com as categorias
      })
      .catch((error) => {
        console.error("Erro ao buscar categorias:", error);
      });

    const fetchProjetos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/projetos"); // Busca todos os projetos
        const userId = localStorage.getItem("userId"); // Recupera o ID do usuário do localStorage
        console.log("UserID: ", userId);
        const projetosData = response.data;

        setProjetos(projetosData); // Atualiza a lista de projetos
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      }
    };

    fetchProjetos(); // Chama a função para buscar projetos
  }, []); // Executa apenas na montagem do componente

  // Função para lidar com a mudança de seleção de categorias
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(categoryId)) { // Se a categoria já estiver selecionada, remove
        return prevSelected.filter((id) => id !== categoryId);
      } else { // Caso contrário, adiciona
        return [...prevSelected, categoryId];
      }
    });
  };

  // Função para lidar com a mudança de seleção de turmas
  const handleClassChange = (classId) => {
    setSelectedClasses((prevSelected) => {
      if (prevSelected.includes(classId)) { // Se a turma já estiver selecionada, remove
        return prevSelected.filter((id) => id !== classId);
      } else { // Caso contrário, adiciona
        return [...prevSelected, classId];
      }
    });
  };

  // Filtra os projetos com base nas categorias e turmas selecionadas
  const filteredProjetos = projetos.filter(
    (projeto) =>
      (selectedCategories.length === 0 ||
        selectedCategories.includes(projeto.categoria_id)) &&
      (selectedClasses.length === 0 ||
        selectedClasses.includes(projeto.turma_id))
  );

  return (
    <div className="container px-4 py-8 mx-auto bg-white">
      <h1 className="text-3xl font-bold text-black dark:text-white">
        Projetos
      </h1>
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full pt-8 md:w-3/4">
          {/* Formulário de pesquisa */}
          <form className="flex items-center mx-auto" onSubmit={handleSearch}>
            <label htmlFor="default-search" className="sr-only">
              Pesquisar
            </label>
            <div className="relative w-full">
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                placeholder="Buscar..."
                required
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado do termo de busca
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center px-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </button>
            </div>
          </form>
          <div className="pt-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {filteredProjetos.map((projeto) => (
                <div
                  key={projeto.id}
                  className="flex z-50 justify-between items-start w-full p-4 bg-gray-100 border border-gray-200 rounded-lg shadow-md"
                >
                  <div className="flex-grow">
                    <h2 className="text-lg font-medium text-gray-800 truncate">
                      <a
                        href={`/projeto/${projeto.id}`}
                        className="cursor-pointer"
                      >
                        {projeto.nome}
                      </a>
                    </h2>
                    <div className="space-x-4 text-sm text-gray-500">
                      <span>
                        {categorias.find((cat) => cat.id === projeto.categoria_id)?.nome}
                      </span>
                      <span>
                        {turmas.find((turma) => turma.id === projeto.turma_id)?.nome}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleModal(projeto.id)}
                    className="flex items-center justify-center w-10 h-10 text-2xl font-bold text-gray-800 transition-all duration-300 ease-in-out rounded-full hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              ))}


              {/* Card para adicionar novo projeto */}
              <div className="flex items-center justify-between w-full p-4 bg-gray-100 border-2 border-gray-200 border-dashed rounded-lg shadow-md hover:shadow-lg">
                <div>
                  <h2 className="text-lg font-medium text-gray-800">
                    Adicionar Novo Projeto
                  </h2>
                  <div className="space-x-4 text-sm text-gray-500">
                    <span>Disciplinas</span>
                    <span>Salas</span>
                  </div>
                </div>
                <button
                  onClick={toggleAddModal} // Abre o modal para adicionar projeto
                  className="relative flex items-center justify-center w-10 h-10 text-2xl font-bold text-gray-800 transition-all duration-300 ease-in-out rounded-full hover:bg-gray-200 hover:ring-2 hover:ring-gray-400 hover:shadow-lg"
                  aria-label="Adicionar Novo Projeto"
                >
                  <img src={AddIcon} alt="Adicionar" /> {/* Ícone de adicionar */}
                </button>
              </div>
            </div>
          </div>

        </aside>

        {/* Componente de filtro, se necessário */}
        <aside className="w-full pt-8 md:w-1/4">
          <div className="mt-4">
            <h2 className="py-1 pl-3 text-2xl text-white rounded-md bg-gradient-to-r from-green-400 via-green-500 to-green-600">
              Filtrar por Disciplina
            </h2>
          </div>
          <ul className="p-4 space-y-2">
            {Array.isArray(categorias) &&
              categorias.map((categoria) => ( // Mapeia as categorias para opções de filtro
                <li key={categoria.id} className="flex items-center">
                  <input
                    id={categoria.id}
                    type="checkbox"
                    value={categoria.id}
                    onChange={() => handleCategoryChange(categoria.id)} // Altera seleção de categoria
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <label
                    htmlFor={categoria.id}
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    {categoria.nome} {/* Nome da categoria */}
                  </label>
                </li>
              ))}

          </ul>
          <div className="mt-4">
            <h2 className="py-1 pl-3 text-2xl text-white rounded-md bg-gradient-to-r from-green-400 via-green-500 to-green-600">
              Filtrar por Turma
            </h2>
          </div>
          <ul className="p-4 space-y-2">
            {Array.isArray(turmas) &&
              turmas.map((turma) => ( // Mapeia as turmas para opções de filtro
                <li key={turma.id} className="flex items-center">
                  <input
                    id={turma.id}
                    type="checkbox"
                    value={turma.id}
                    onChange={() => handleClassChange(turma.id)} // Altera seleção de turma
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                  />
                  <label
                    htmlFor={turma.id}
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    {turma.nome} {/* Nome da turma */}
                  </label>
                </li>
              ))}
          </ul>
        </aside>
      </div>

      {/* Modais para visualização e adição de projetos */}
      <Modal
        isOpen={isOpen}
        toggleModal={toggleModal}
        projectId={selectedProjectId}
      />
      <ModalAdicionar isOpen={isAddModalOpen} toggleModal={toggleAddModal} />
    </div>
  );
}

export default Projetos; // Exporta o componente Projetos
