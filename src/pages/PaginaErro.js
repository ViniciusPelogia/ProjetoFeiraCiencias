import React from 'react'

const PaginaErro = () => {
    return (
        <div>
            <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-base font-semibold text-green-600">404</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Página não encontrada</h1>
                    <p className="mt-6 text-base leading-7 text-gray-600">Ops! Não foi possível encontrar a página, verifique se a URL está correta.</p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a href="/Login" className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Voltar</a>                    </div>
                </div>
            </main>
        </div>
    )
}

export default PaginaErro;
