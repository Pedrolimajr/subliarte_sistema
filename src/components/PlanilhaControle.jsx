import { useEffect, useState } from 'react';
import '/src/styles/PlanilhaControle.css'; // Importando o arquivo de estilo

const PlanilhaControle = () => {
  const [planilhas, setPlanilhas] = useState([]);

  // Carrega as planilhas salvas do localStorage
  useEffect(() => {
    const savedPlanilhas = JSON.parse(localStorage.getItem('planilhas')) || [];
    setPlanilhas(savedPlanilhas);
  }, []);

  // Salva as planilhas no localStorage sempre que planilhas mudar
  useEffect(() => {
    if (planilhas.length > 0) {
      localStorage.setItem('planilhas', JSON.stringify(planilhas));
    }
  }, [planilhas]);

  const adicionarPlanilha = () => {
    const novoNome = `Planilha ${planilhas.length + 1}`;
    const novaPlanilha = { nome: novoNome, linhas: [] };
    setPlanilhas((prevPlanilhas) => {
      const novasPlanilhas = [...prevPlanilhas, novaPlanilha];
      return novasPlanilhas;
    });
  };

  const adicionarLinha = (index) => {
    const novasLinhas = [
      ...planilhas[index].linhas,
      { produto: '', cliente: '', data: '', qtd: '', valor: '', total: '', gasto: '', lucro: '', entrega: '', status: '', situacao: '' }
    ];
    setPlanilhas((prevPlanilhas) => {
      const novasPlanilhas = [...prevPlanilhas];
      novasPlanilhas[index].linhas = novasLinhas;
      return novasPlanilhas;
    });
  };

  const excluirLinha = (planilhaIndex, linhaIndex) => {
    setPlanilhas((prevPlanilhas) => {
      const novasPlanilhas = [...prevPlanilhas];
      novasPlanilhas[planilhaIndex].linhas.splice(linhaIndex, 1);
      return novasPlanilhas;
    });
  };

  const excluirPlanilha = (index) => {
    setPlanilhas((prevPlanilhas) => {
      const novasPlanilhas = prevPlanilhas.filter((_, i) => i !== index);
      return novasPlanilhas;
    });
  };

  // Atualiza campos específicos da primeira planilha
  const handleFieldChange = (index, field, value) => {
    const updatedPlanilhas = [...planilhas];
    updatedPlanilhas[0].linhas[index][field] = value;
    setPlanilhas(updatedPlanilhas);
  };

  const handleTitleChange = (planilhaIndex, valor) => {
    setPlanilhas((prevPlanilhas) => {
      const novasPlanilhas = [...prevPlanilhas];
      novasPlanilhas[planilhaIndex].nome = valor;
      return novasPlanilhas;
    });
  };

  return (
    <div className="container">
      <h1 className='planilha-controle'>Planilha de Controle</h1>
      <button className="add-button2" onClick={adicionarPlanilha}>Adicionar Planilha</button>
      <hr />

      {planilhas.map((planilha, planilhaIndex) => (
        <div key={planilhaIndex} className="planilha-container">
          <h2 className="planilha-title">
            <input
              type="text"
              value={planilha.nome}
              onChange={(e) => handleTitleChange(planilhaIndex, e.target.value)}
              className="input-field-title"
            />
            <button className="delete-button2" onClick={() => excluirPlanilha(planilhaIndex)}>Excluir Planilha</button>
          </h2>
          <table className="planilha-table">
            <thead>
              <tr>
                <th className='prd'>Produto</th>
                <th className='cl'>Cliente</th>
                <th className='dt'>Data</th>
                <th>Qtd</th>
                <th className='vl'>Valor</th>
                <th className='tot'>Total</th>
                <th className='gast'>Gasto</th>
                <th className='lucr'>Lucro</th>
                <th className='entg'>Entrega</th>
                <th className='sta'>Status</th>
                <th className='sit'>Situação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {planilha.linhas.map((linha, linhaIndex) => (
                <tr key={linhaIndex}>
                  {Object.keys(linha).map((campo) => (
                    <td key={campo}>
                      <input
                        className="input-field input-field2"
                        type="text"
                        value={linha[campo]}
                        onChange={(e) => handleFieldChange(linhaIndex, campo, e.target.value)}
                      />
                    </td>
                  ))}
                  <td>
                    <button className="delete-button" onClick={() => excluirLinha(planilhaIndex, linhaIndex)}>Excluir</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="11">
                  <button className="add-button" onClick={() => adicionarLinha(planilhaIndex)}>Adicionar Linha</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default PlanilhaControle;
