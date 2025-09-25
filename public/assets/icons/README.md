# Iconos Disponibles

Esta carpeta contiene todos los iconos SVG utilizados en la aplicación.

## Iconos del Sistema

- `home.svg` - Icono de inicio/casa
- `user.svg` - Icono de usuario
- `logout.svg` - Icono de cerrar sesión
- `menu.svg` - Icono de menú hamburguesa
- `shopping-cart.svg` - Icono de carrito de compras
- `search.svg` - Icono de búsqueda
- `phone.svg` - Icono de teléfono
- `mail.svg` - Icono de correo electrónico

## Uso en React

```jsx
// Usando el componente Icon
import Icon from '../components/Icon';

<Icon name="shopping-cart" size={20} className="nav-icon" />

// Usando directamente
<img src="/assets/icons/shopping-cart.svg" alt="Carrito" className="nav-icon" />
```

## Estilos CSS

Los iconos pueden ser estilizados usando filtros CSS:

```css
/* Para iconos blancos en navbar oscuro */
.nav-icon {
  filter: brightness(0) invert(1);
}

/* Para iconos de color primario */
.btn-icon {
  filter: brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
}
```



