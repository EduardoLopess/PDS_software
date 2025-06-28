import { useEffect, useState } from 'react'
import { Mesa } from '../../components/mesa/Index'
import './Mesas-Screen-Style.css'
import { getMesas } from '../../service/api/MesaService'

export const MesaScreen = () => {
    const [mesaData, setMesa] = useState([])
    const [statusFilter, setStatusFilter] = useState(null)
    const [termoBusca, setTermoBusca] = useState('')

    useEffect(() => {
        getMesas()
            .then(res => {
                console.log('Resposta da API MESAS', res.data.data)
                setMesa(res.data.data)
            })
            .catch(err => console.error('Erro ao buscar mesas', err))
    }, [])

    const filterData = mesaData.filter((item) => {
        if (termoBusca && !item.numeroMesa.toString().includes(termoBusca)) {
            return false
        }

        if (statusFilter !== null && item.statusMesa !== statusFilter) {
            return false
        }

        return true
    })

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
            <div className='container-mesaScreen'>

                <div className='container-btn-mesaScreen'>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder='Ex: 1'
                            className='input-pesquisa-mesaScreen'
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                        />
                    </div>

                    {statusFilter === null ? (
                        <>
                            <button style={{ background: 'green' }} onClick={() => setStatusFilter(false)}>
                                <p>LIVRES</p>
                            </button>
                            <button style={{ background: '#E90000' }} onClick={() => setStatusFilter(true)}>
                                <p>OCUPADAS</p>
                            </button>
                        </>
                    ) : (
                        <button style={{ background: '#555' }} onClick={() => setStatusFilter(null)}>
                            <p>TODOS</p>
                        </button>
                    )}
                </div>

                <div className='container-mesas-mesaScreen'>
                    {filterData.length > 0 ? (
                        filterData
                            .sort((a, b) => a.numeroMesa - b.numeroMesa)
                            .map((item) => (
                                <Mesa
                                    key={item.id}
                                    id={item.id}
                                    numeroMesa={item.numeroMesa}
                                    statusMesa={item.statusMesa}
                                />
                            ))
                    ) : (
                        <p style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma mesa encontrada.</p>
                    )}

                </div>

            </div>
        </div>
    )
}
