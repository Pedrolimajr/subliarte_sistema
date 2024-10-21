import images from '/src/images'; // Importando o array de imagens
import '/src/styles/Gallery.css';

const Gallery = () => {
  return (
    <div className="gallery-container"> {/* Adicionando a nova div container */}
      <h1 className='h1-gallery'>Fotos Produtos</h1>
      <div className="gallery"> {/* Movi a galeria para dentro da nova div */}
        {images.map((image, index) => (
          <div className="gallery-item" key={index}>
            <img src={image} alt={`Gallery item ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
