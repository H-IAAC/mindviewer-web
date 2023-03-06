import HeaderProps from '../../@types/HeaderProps';
import HeaderController from './controller';

//Componente do Header (cabeçalho)
const Header = (props: HeaderProps) => {
  return(
    <HeaderController 
      {...props}
    />
  )
}

export default Header;