
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get('/api/projetos', (req, res) => {
  const data = fs.readFileSync('db.json', 'utf-8');
  const projetos = JSON.parse(data);
  res.json(projetos);
});

app.post('/api/projetos', (req, res) => {
  const projeto = req.body;
  const data = fs.readFileSync('db.json', 'utf-8');
  const projetos = JSON.parse(data);
  projetos.push(projeto);
  fs.writeFileSync('db.json', JSON.stringify(projetos));
  res.json(projeto);
});

app.put('/api/projetos/:id', (req, res) => {
  const projetoId = parseInt(req.params.id);
  const updatedProjeto = req.body;
  const data = fs.readFileSync('db.json', 'utf-8');
  const projetos = JSON.parse(data);
  const existingProjeto = projetos.find(p => p.id === projetoId);

  if (existingProjeto) {
    Object.assign(existingProjeto, updatedProjeto);
    fs.writeFileSync('db.json', JSON.stringify(projetos));
    res.json(existingProjeto);
  } else {
    res.status(404).json({ message: 'Projeto não encontrado' });
  }
});

app.delete('/api/projetos/:id', (req, res) => {
  const projetoId = parseInt(req.params.id);
  const data = fs.readFileSync('db.json', 'utf-8');
  const projetos = JSON.parse(data);
  const index = projetos.findIndex(p => p.id === projetoId);

  if (index !== -1) {
    const deletedProjeto = projetos.splice(index, 1)[0];
    fs.writeFileSync('db.json', JSON.stringify(projetos));
    res.json(deletedProjeto);
  } else {
    res.status(404).json({ message: 'Projeto não encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
