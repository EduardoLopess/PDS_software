// import { useEffect, useState } from "react"
// import { useCarrinho } from "../../../context/CarrinhoContext"
// import { getSabor } from "../../../service/api/SaborService"

// export const useDrinkSabor = () => {
//     const { setSaborDataContext } = useCarrinho
//     const [saborData, setSaborData] = useState([])

//     useEffect(() => {
//         getSabor()
//             .then(res => {
//                 console.log("Respota api SABOR: ", res.data)
//                 setSaborData(res.data.data)
//                 setSaborDataContext(res.data.data)
//             })
//             .catch(err => console.error("Erro ao buscar sabores.", err))
//     }, [])


//     const tipoDrink = (idDrink) => {

//     }


//     return (

//     )
// }