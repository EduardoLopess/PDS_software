import { useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Button, Box } from "@chakra-ui/react";
import { useCarrinho } from "../../context/CarrinhoContext";
import { IoCartOutline } from "react-icons/io5";
import './Carrinho-Style.css';

export const Carrinho = () => {
    const { carrinhoVisivel } = useCarrinho();
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!carrinhoVisivel) return null;

    return (
        <div className="container-carrinho">
            <button onClick={onOpen} style={{ all: 'unset', cursor: 'pointer' }}>
                <IoCartOutline size={45} color="black" />
            </button>

            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Carrinho de Compras</DrawerHeader>

                    <DrawerBody>
                        {/* Aqui você pode renderizar os itens do carrinho */}
                        <Box mb={4}>
                            Nenhum item ainda.
                        </Box>

                        <Button colorScheme="red" onClick={onClose}>
                            Fechar
                        </Button>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    );
};
