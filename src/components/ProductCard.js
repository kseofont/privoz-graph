import React from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const ProductCard = ({ productCard }) => {
    console.log('productCard', productCard)
    const imageUrl = `./img/${productCard.product.image}`;

    return (
        <div className="card mt-3   mb-3 p-3">
            <img src={imageUrl} className="card-img-top" alt={productCard.product.name} />
            <div className="card-body">
                <h5 className="card-title">{productCard.product.name}</h5>
                <p className="card-text">{productCard.product.description}</p>
                {productCard.product.buyPrice && ( // Conditionally render price if available
                    <p className="card-text">Buy Price: <span className='red'>${productCard.product.buyPrice}</span></p>
                )}
                {productCard.product.sellPrice && ( // Conditionally render price if available
                    <p className="card-text">Sell Price: <span className="green">${productCard.product.sellPrice}</span></p>
                )}
                {productCard.product.sector.name && ( // Conditionally render price if available
                    <p className="card-text">Sector: <span className="">{productCard.product.sector.name}</span></p>
                )}
                {productCard.product.stock && ( // Conditionally render stock if available
                    <p className="card-text">Stock: {productCard.product.stock}</p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;