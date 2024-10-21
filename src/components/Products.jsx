import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import '/src/styles/Products.css';

const Products = () => {
  const loadFromLocalStorage = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  const [products, setProducts] = useState(() => loadFromLocalStorage('products', [
    { id: 1, name: 'Caneca', price: 30.00, stock: 10, entryDate: '', exitDate: '' },
    { id: 2, name: 'Sandália', price: 35.00, stock: 20, entryDate: '', exitDate: '' },
    { id: 3, name: 'Azulejo 20x20', price: 40.00, stock: 15, entryDate: '', exitDate: '' },
  ]));

  const [movements, setMovements] = useState(() => loadFromLocalStorage('movements', []));
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
  const [showForm, setShowForm] = useState(false);
  const [showEntryExitModal, setShowEntryExitModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [entryExit, setEntryExit] = useState({ type: '', productId: '', quantity: '' });
  const [searchTerm, setSearchTerm] = useState(''); // Novo estado para o termo de pesquisa


  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('movements', JSON.stringify(movements));
  }, [movements]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Atualiza o estado do termo de pesquisa
  };


  const handleAddProduct = (e) => {
    e.preventDefault();
    if (editingProduct) {
      const updatedProducts = products.map(product =>
        product.id === editingProduct.id
          ? { ...editingProduct, name: newProduct.name, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) }
          : product
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
    } else {
      const productToAdd = {
        id: products.length + 1,
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        entryDate: '',
        exitDate: ''
      };
      setProducts([...products, productToAdd]);

      const newMovement = {
        type: 'Cadastro',
        productName: newProduct.name,
        quantity: newProduct.stock,
        dateTime: new Date().toLocaleString(),
      };
      setMovements([...movements, newMovement]);
    }

    setNewProduct({ name: '', price: '', stock: '' });
    setShowForm(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({ name: product.name, price: product.price.toString(), stock: product.stock.toString() });
    setShowForm(true);
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
  };

  const handleDeleteMovement = (movementIndex) => {
    const updatedMovements = movements.filter((_, index) => index !== movementIndex);
    setMovements(updatedMovements);
  };

  const handleDeleteAllMovements = () => {
    setMovements([]);
  };

  const toggleFormVisibility = () => {
    setShowForm(!showForm);
  };

  const toggleReportModal = () => {
    setShowReportModal(!showReportModal);
  };

  const toggleEntryExitModal = () => {
    setShowEntryExitModal(!showEntryExitModal);
  };

  const handleEntryExit = (e) => {
    const { name, value } = e.target;
    setEntryExit({ ...entryExit, [name]: value });
  };

  const processEntryExit = () => {
    const { productId, quantity, type } = entryExit;
    if (!productId || !quantity || !type) return;

    const updatedProducts = products.map(product => {
      if (product.id === parseInt(productId)) {
        const updatedStock = type === 'Entrada'
          ? product.stock + parseInt(quantity)
          : product.stock - parseInt(quantity);

        return { ...product, stock: updatedStock, [`${type === 'Entrada' ? 'entryDate' : 'exitDate'}`]: new Date().toLocaleDateString() };
      }
      return product;
    });

    setProducts(updatedProducts);

    const product = products.find(product => product.id === parseInt(productId));
    const newMovement = {
      type,
      productName: product.name,
      quantity: parseInt(quantity),
      dateTime: new Date().toLocaleString(),
    };

    setMovements([...movements, newMovement]);
    setEntryExit({ type: '', productId: '', quantity: '' });
    setShowEntryExitModal(false);
  };

  const exportReport = () => {
    if (exportFormat === 'pdf') {
      const doc = new jsPDF();
      doc.text("Relatório de Movimentações", 10, 10);
      autoTable(doc, {
        head: [['Tipo', 'Produto', 'Quantidade', 'Data e Hora']],
        body: movements.map(movement => [movement.type, movement.productName, movement.quantity, movement.dateTime]),
      });
      doc.save("relatorio_movimentacoes.pdf");
    } else if (exportFormat === 'jpeg') {
      const reportElement = document.getElementById('report-table');
      html2canvas(reportElement).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg');
        link.download = 'relatorio_movimentacoes.jpeg';
        link.click();
      });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

// Filtra os produtos com base no termo de pesquisa
const filteredProducts = products.filter(product => 
  product.name.toLowerCase().includes(searchTerm.toLowerCase())
);



  return (
    <div className="container-products">
      <h1 className="h1-products">Produtos</h1>
      <div className="search-container">
  <input
    type="text"
    placeholder="Pesquisar produtos..."
    value={searchTerm}
    onChange={handleSearchChange}
    className="search-input" // Classe para estilizar o campo de texto
  />
  <button className="search-btn">Pesquisar</button>
</div>
      


      <div className="buttons-container">
        <button className="toggle-form-btn" onClick={toggleFormVisibility}>
          {showForm ? 'Ocultar Cadastro' : 'Cadastrar Novo Produto'}
        </button>

        <button className="toggle-form-btn" onClick={toggleReportModal}>
          {showReportModal ? 'Ocultar Relatório' : 'Gerar Relatório'}
        </button>

        <button className="toggle-form-btn" onClick={() => { setEntryExit({ ...entryExit, type: 'Entrada' }); toggleEntryExitModal(); }}>
          Entrada de Produtos
        </button>

        <button className="toggle-form-btn" onClick={() => { setEntryExit({ ...entryExit, type: 'Saída' }); toggleEntryExitModal(); }}>
          Saída de Produtos
        </button>
      </div>

      {showForm && (
        <div className="overlay" onClick={toggleFormVisibility}>
          <div className="product-form-container report-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleAddProduct} className="product-form">
              <h2>{editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>
              <input
                type="text"
                name="name"
                placeholder="Nome do Produto"
                value={newProduct.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Preço"
                value={newProduct.price}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Quantidade Inicial"
                value={newProduct.stock}
                onChange={handleInputChange}
                required
              />
              <button type="submit">{editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}</button>
            </form>
          </div>
        </div>
      )}

      {showEntryExitModal && (
        <div className="overlay" onClick={toggleEntryExitModal}>
          <div className="product-form-container report-modal" onClick={e => e.stopPropagation()}>
            <h2>{entryExit.type} de Produtos</h2>
            <select name="productId" value={entryExit.productId} onChange={handleEntryExit}>
              <option value="">Selecione um produto</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="quantity"
              placeholder="Quantidade"
              value={entryExit.quantity}
              onChange={handleEntryExit}
              required
            />
            <button onClick={processEntryExit}>Confirmar</button>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="overlay" onClick={toggleReportModal}>
          <div className="product-form-container report-modal" onClick={e => e.stopPropagation()}>
            <h2>Relatório de Movimentações</h2>
            <div id="report-table">
              <table>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Data e Hora</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.length > 0 ? (
                    movements.map((movement, index) => (
                      <tr key={index}>
                        <td>{movement.type}</td>
                        <td>{movement.productName}</td>
                        <td>{movement.quantity}</td>
                        <td>{movement.dateTime}</td>
                        <td>
                          <button className='report-excluir' onClick={() => handleDeleteMovement(index)}>Excluir</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">Nenhuma movimentação registrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {movements.length > 0 && (
                <div>
                  <button className='report-excluir' onClick={handleDeleteAllMovements}>Excluir Todas as Movimentações</button>
                </div>
              )}
            </div>
            <div>
              <label>
                Exportar como:
                <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="pdf">PDF</option>
                  <option value="jpeg">JPEG</option>
                </select>
              </label>
              <button onClick={exportReport}>Exportar Relatório</button>
            </div>
          </div>
        </div>
      )}

      <table className="products-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Quantidade em Estoque</th>
            <th className='acoes-products'>Ações</th>
          </tr>
        </thead>
        <tbody>
          
        {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.stock}</td>
                <td>
                <button className='btn-editar' onClick={() => handleEditProduct(product)}>Editar</button>
                <button className='btn-excluir' onClick={() => handleDeleteProduct(product.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;


















/*-----------------------------------------------------------*/
// import { useState, useEffect } from 'react';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import '/src/styles/Products.css';

// const Products = () => {
//   // Função para carregar dados do localStorage
//   const loadFromLocalStorage = (key, defaultValue) => {
//     const storedValue = localStorage.getItem(key);
//     return storedValue ? JSON.parse(storedValue) : defaultValue;
//   };

//   const [products, setProducts] = useState(() => loadFromLocalStorage('products', [
//     { id: 1, name: 'Caneca', price: 30.00, stock: 10, entryDate: '', exitDate: '' },
//     { id: 2, name: 'Sandália', price: 35.00, stock: 20, entryDate: '', exitDate: '' },
//     { id: 3, name: 'Azulejo 20x20', price: 40.00, stock: 15, entryDate: '', exitDate: '' },
//   ]));

//   const [movements, setMovements] = useState(() => loadFromLocalStorage('movements', []));
//   const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
//   const [showForm, setShowForm] = useState(false);
//   const [showEntryExitModal, setShowEntryExitModal] = useState(false);
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [exportFormat, setExportFormat] = useState('');
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [entryExit, setEntryExit] = useState({ type: '', productId: '', quantity: '' });

//   // Atualiza o localStorage sempre que os produtos ou movimentações mudarem
//   useEffect(() => {
//     localStorage.setItem('products', JSON.stringify(products));
//   }, [products]);

//   useEffect(() => {
//     localStorage.setItem('movements', JSON.stringify(movements));
//   }, [movements]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewProduct({ ...newProduct, [name]: value });
//   };

//   const handleAddProduct = (e) => {
//     e.preventDefault();
//     if (editingProduct) {
//       const updatedProducts = products.map(product =>
//         product.id === editingProduct.id
//           ? { ...editingProduct, name: newProduct.name, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) }
//           : product
//       );
//       setProducts(updatedProducts);
//       setEditingProduct(null);
//     } else {
//       const productToAdd = {
//         id: products.length + 1,
//         name: newProduct.name,
//         price: parseFloat(newProduct.price),
//         stock: parseInt(newProduct.stock),
//         entryDate: '',
//         exitDate: ''
//       };
//       setProducts([...products, productToAdd]);

//       const newMovement = {
//         type: 'Cadastro',
//         productName: newProduct.name,
//         quantity: newProduct.stock,
//         dateTime: new Date().toLocaleString(),
//       };
//       setMovements([...movements, newMovement]);
//     }

//     setNewProduct({ name: '', price: '', stock: '' });
//     setShowForm(false);
//   };

//   const handleEditProduct = (product) => {
//     setEditingProduct(product);
//     setNewProduct({ name: product.name, price: product.price.toString(), stock: product.stock.toString() });
//     setShowForm(true);
//   };

//   const handleDeleteProduct = (productId) => {
//     const updatedProducts = products.filter(product => product.id !== productId);
//     setProducts(updatedProducts);
//   };

//   const toggleFormVisibility = () => {
//     setShowForm(!showForm);
//   };

//   const toggleReportModal = () => {
//     setShowReportModal(!showReportModal);
//   };

//   const toggleEntryExitModal = () => {
//     setShowEntryExitModal(!showEntryExitModal);
//   };

//   const handleEntryExit = (e) => {
//     const { name, value } = e.target;
//     setEntryExit({ ...entryExit, [name]: value });
//   };

//   const processEntryExit = () => {
//     const { productId, quantity, type } = entryExit;
//     if (!productId || !quantity || !type) return;

//     const updatedProducts = products.map(product => {
//       if (product.id === parseInt(productId)) {
//         const updatedStock = type === 'Entrada'
//           ? product.stock + parseInt(quantity)
//           : product.stock - parseInt(quantity);

//         return { ...product, stock: updatedStock, [`${type === 'Entrada' ? 'entryDate' : 'exitDate'}`]: new Date().toLocaleDateString() };
//       }
//       return product;
//     });

//     setProducts(updatedProducts);

//     const product = products.find(product => product.id === parseInt(productId));
//     const newMovement = {
//       type,
//       productName: product.name,
//       quantity: parseInt(quantity),
//       dateTime: new Date().toLocaleString(),
//     };

//     setMovements([...movements, newMovement]);
//     setEntryExit({ type: '', productId: '', quantity: '' });
//     setShowEntryExitModal(false);
//   };

//   /* Relatório de movimentação - Início */
//   const exportReport = () => {
//     if (exportFormat === 'pdf') {
//       const doc = new jsPDF();
//       doc.text("Relatório de Movimentações", 10, 10);
//       doc.autoTable({
//         head: [['Tipo', 'Produto', 'Quantidade', 'Data e Hora']],
//         body: movements.map(movement => [movement.type, movement.productName, movement.quantity, movement.dateTime]),
//       });
//       doc.save("relatorio_movimentacoes.pdf");
//     } else if (exportFormat === 'jpeg') {
//       const reportElement = document.getElementById('report-table');
//       html2canvas(reportElement).then((canvas) => {
//         const link = document.createElement('a');
//         link.href = canvas.toDataURL('image/jpeg');
//         link.download = 'relatorio_movimentacoes.jpeg';
//         link.click();
//       });
//     }
//   };
//   /* Relatório de movimentação - Fim */

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat('pt-BR', {
//       style: 'currency',
//       currency: 'BRL',
//     }).format(value);
//   };

//   return (
//     <div className="container-products">
//       <h1 className="h1-products">Produtos</h1>

//       <div className="buttons-container">
//         <button className="toggle-form-btn" onClick={toggleFormVisibility}>
//           {showForm ? 'Ocultar Cadastro' : 'Cadastrar Novo Produto'}
//         </button>

//         <button className="toggle-form-btn" onClick={toggleReportModal}>
//           {showReportModal ? 'Ocultar Relatório' : 'Gerar Relatório'}
//         </button>

//         <button className="toggle-form-btn" onClick={() => { setEntryExit({ ...entryExit, type: 'Entrada' }); toggleEntryExitModal(); }}>
//           Entrada de Produtos
//         </button>

//         <button className="toggle-form-btn" onClick={() => { setEntryExit({ ...entryExit, type: 'Saída' }); toggleEntryExitModal(); }}>
//           Saída de Produtos
//         </button>
//       </div>

//       {showForm && (
//         <div className="overlay" onClick={toggleFormVisibility}>
//           <div className="product-form-container report-modal" onClick={e => e.stopPropagation()}>
//             <form onSubmit={handleAddProduct} className="product-form">
//               <h2>{editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Nome do Produto"
//                 value={newProduct.name}
//                 onChange={handleInputChange}
//                 required
//               />
//               <input
//                 type="number"
//                 name="price"
//                 placeholder="Preço"
//                 value={newProduct.price}
//                 onChange={handleInputChange}
//                 required
//               />
//               <input
//                 type="number"
//                 name="stock"
//                 placeholder="Quantidade Inicial"
//                 value={newProduct.stock}
//                 onChange={handleInputChange}
//                 required
//               />
//               <button type="submit">{editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}</button>
//             </form>
//           </div>
//         </div>
//       )}

//       {showEntryExitModal && (
//         <div className="overlay" onClick={toggleEntryExitModal}>
//           <div className="product-form-container" onClick={e => e.stopPropagation()}>
//             <h2>Entrada e Saída de Produtos</h2>
//             <select name="productId" value={entryExit.productId} onChange={handleEntryExit}>
//               <option value="">Selecione um Produto</option>
//               {products.map(product => (
//                 <option key={product.id} value={product.id}>{product.name}</option>
//               ))}
//             </select>
//             <input
//               type="number"
//               name="quantity"
//               placeholder="Quantidade"
//               value={entryExit.quantity}
//               onChange={handleEntryExit}
//               required
//             />
//             <button onClick={processEntryExit}>Confirmar</button>
//           </div>
//         </div>
//       )}

//       {showReportModal && (
//         <div className="overlay" onClick={toggleReportModal}>
//           <div className="product-form-container report-modal" onClick={e => e.stopPropagation()}>
//             <h2>Gerar Relatório de Movimentações</h2>
//             <select onChange={e => setExportFormat(e.target.value)} value={exportFormat}>
//               <option value="">Selecione o formato</option>
//               <option value="pdf">PDF</option>
//               <option value="jpeg">JPEG</option>
//             </select>
//             <button onClick={exportReport}>Exportar Relatório</button>
//           </div>
//         </div>
//       )}

//       <table className="product-table">
//         <thead>
//           <tr>
//             <th>Nome</th>
//             <th>Preço</th>
//             <th>Estoque</th>
//             <th className='acoes-produto'>Ações</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map(product => (
//             <tr key={product.id}>
//               <td>{product.name}</td>
//               <td>{formatCurrency(product.price)}</td>
//               <td>{product.stock}</td>
//               <td>
//                 <button className='btn-product btn-editar' onClick={() => handleEditProduct(product)}>Editar</button>
//                 <button className='btn-product btn-excluir' onClick={() => handleDeleteProduct(product.id)}>Excluir</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Products;









