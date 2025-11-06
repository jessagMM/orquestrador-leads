document.addEventListener('DOMContentLoaded', () => {
  const mockData = {
    fields: [
      {
        id: 1,
        name: 'Valor mínimo',
        slug: 'minimum-value',
        type: 'number',
        template_id: 10,
      },
      {
        id: 2,
        name: 'Divisão percentual do recuperador carrinho',
        slug: 'cart-recovery-split',
        type: 'number',
        template_id: 11,
      },
      {
        id: 3,
        name: 'Divisão percentual do recuperador telefone',
        slug: 'phone-recovery-split',
        type: 'number',
        template_id: 11,
      },
      {
        id: 4,
        name: 'Divisão percentual da Zendesk',
        slug: 'zendesk-split',
        type: 'number',
        template_id: 11,
      },
    ],
    parameters: [
      { id: 1, value: '500', rule_id: 6, field_id: 1 },
      { id: 2, value: '50', rule_id: 7, field_id: 2 },
      { id: 3, value: '45', rule_id: 7, field_id: 3 },
      { id: 4, value: '5', rule_id: 7, field_id: 4 },
    ],
    rules: [
      {
        id: 1,
        name: 'Cria vínculo',
        description: 'Cria vínculo entre atendente e cliente',
        weight: 0,
        enabled: 1,
        ruleset_id: 1,
        template_id: 1,
      },
      {
        id: 2,
        name: 'Envia orçamento pelo MMPostman',
        description: 'Envia orçamento para o cliente pelo MMPostman',
        weight: 1,
        enabled: 1,
        ruleset_id: 1,
        template_id: 2,
      },
      {
        id: 3,
        name: 'Salva oportunidade',
        description: 'Salva oportunidade',
        weight: 2,
        enabled: 1,
        ruleset_id: 1,
        template_id: 3,
      },
      {
        id: 4,
        name: 'Filtra atendentes de guideshop',
        description:
          'Ignora oportunidades associadas a atendentes de guideshop',
        weight: 0,
        enabled: 1,
        ruleset_id: 3,
        template_id: 8,
      },
      {
        id: 5,
        name: 'Filtra clientes sem telefone',
        description: 'Ignora oportunidades de clientes sem número de telefone',
        weight: 1,
        enabled: 1,
        ruleset_id: 3,
        template_id: 9,
      },
      {
        id: 6,
        name: 'Define valor mínimo',
        description: 'Ignora oportunidades abaixo do valor mínimo',
        weight: 2,
        enabled: 1,
        ruleset_id: 3,
        template_id: 10,
      },
      {
        id: 7,
        name: 'Segmenta recuperador carrinho',
        description:
          'Define valores percentuais de segmentação do recuperador carrinho com outros destinos',
        weight: 3,
        enabled: 1,
        ruleset_id: 3,
        template_id: 11,
      },
      {
        id: 8,
        name: 'Salva oportunidade',
        description: 'Salva oportunidade',
        weight: 4,
        enabled: 1,
        ruleset_id: 3,
        template_id: 3,
      },
    ],
    rulesets: [
      {
        id: 1,
        name: 'Orçamento',
        slug: 'budget',
        description: 'Conjunto de regras de orçamento',
      },
      {
        id: 3,
        name: 'Recuperador Carrinho',
        slug: 'cart-recovery',
        description: 'Conjunto de regras do recuperador carrinho',
      },
    ],
    templates: [
      { id: 1, name: 'Bond Creation', slug: 'bond-creation', terminator: 0 },
      {
        id: 2,
        name: 'MMPostman Send Budget Message',
        slug: 'mmpostman-send-budget-message',
        terminator: 0,
      },
      {
        id: 3,
        name: 'Save Opportunity',
        slug: 'save-opportunity',
        terminator: 1,
      },
      {
        id: 8,
        name: 'Filtrar atendente de guideshop',
        slug: 'guideshop-attendant-filter',
        terminator: 0,
      },
      {
        id: 9,
        name: 'Filtrar cliente sem telefone',
        slug: 'client-without-phone-filter',
        terminator: 0,
      },
      { id: 10, name: 'Valor mínimo', slug: 'minimum-value', terminator: 0 },
      {
        id: 11,
        name: 'Segmentar distribuição do recuperador carrinho',
        slug: 'cart-recovery-split',
        terminator: 0,
      },
    ],
  };

  const rulesetList = document.getElementById('ruleset-list');
  const ruleList = document.getElementById('rule-list');
  const currentRulesetName = document.getElementById('current-ruleset-name');
  const currentRulesetDescription = document.getElementById(
    'current-ruleset-description'
  );
  const saveOrderBtn = document.getElementById('save-order-btn');
  const modal = document.getElementById('edit-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const closeModalBtn = document.querySelector('.close-button');
  const saveParamsBtn = document.getElementById('save-params-btn');

  let currentRules = [];
  let draggedItem = null;

  function renderRulesets() {
    rulesetList.innerHTML = '';
    mockData.rulesets.forEach(ruleset => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="ruleset-name">${ruleset.name}</span>
        <button class="edit-ruleset-btn" data-ruleset-id="${ruleset.id}" title="Editar nome">&#9998;</button>
      `;
      li.dataset.id = ruleset.id;

      const rulesetName = li.querySelector('.ruleset-name');
      rulesetName.addEventListener('click', () => {
        document
          .querySelectorAll('#ruleset-list li')
          .forEach(item => item.classList.remove('active'));
        li.classList.add('active');
        renderRules(ruleset.id);
      });

      rulesetList.appendChild(li);
    });

    addEditRulesetListeners();
  }

  function addEditRulesetListeners() {
    document.querySelectorAll('.edit-ruleset-btn').forEach(button => {
      button.addEventListener('click', e => {
        e.stopPropagation();
        const rulesetId = parseInt(e.currentTarget.dataset.rulesetId, 10);
        editRulesetName(rulesetId);
      });
    });
  }

  function editRulesetName(rulesetId) {
    const ruleset = mockData.rulesets.find(rs => rs.id === rulesetId);
    const newName = prompt(
      'Digite o novo nome para o conjunto de regras:',
      ruleset.name
    );

    if (newName && newName.trim() !== '') {
      ruleset.name = newName.trim();
      console.log(`Ruleset ID ${rulesetId} renomeado para: ${newName}`);

      renderRulesets();

      // Se este ruleset estiver ativo, atualizar o nome exibido
      const activeRuleset = document.querySelector('#ruleset-list li.active');
      if (
        activeRuleset &&
        parseInt(activeRuleset.dataset.id, 10) === rulesetId
      ) {
        activeRuleset.click();
      }
    }
  }

  function renderRules(rulesetId) {
    const ruleset = mockData.rulesets.find(rs => rs.id === rulesetId);
    currentRulesetName.textContent = ruleset.name;
    currentRulesetDescription.textContent = ruleset.description;

    currentRules = mockData.rules
      .filter(rule => rule.ruleset_id === rulesetId)
      .sort((a, b) => a.weight - b.weight);

    ruleList.innerHTML = '';
    currentRules.forEach(rule => {
      const li = document.createElement('li');
      li.className = 'rule-item';
      li.dataset.id = rule.id;

      const template = mockData.templates.find(t => t.id === rule.template_id);
      const isTerminator = template.terminator === 1;

      // Regras com terminator true não podem ser reordenadas
      li.draggable = !isTerminator;
      if (isTerminator) {
        li.classList.add('non-draggable');
      }

      const hasParams = mockData.fields.some(
        f => f.template_id === template.id
      );

      li.innerHTML = `
                <div class="rule-info">
                    <h4>${rule.name}</h4>
                    <p>${rule.description}</p>
                </div>
                <div class="rule-actions">
                    ${
                      hasParams
                        ? `<button class="edit-btn" data-rule-id="${rule.id}">&#9998;</button>`
                        : ''
                    }
                    ${
                      !isTerminator
                        ? `<button class="delete-btn" data-rule-id="${rule.id}" title="Remover regra">&#128465;</button>`
                        : ''
                    }
                    <label class="switch">
                        <input type="checkbox" ${rule.enabled ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            `;
      ruleList.appendChild(li);
    });

    addDragAndDropListeners();
    addEditButtonListeners();
    addDeleteButtonListeners();
  }

  function openModal(ruleId) {
    const rule = mockData.rules.find(r => r.id === ruleId);
    const template = mockData.templates.find(t => t.id === rule.template_id);
    const fields = mockData.fields.filter(f => f.template_id === template.id);

    modalTitle.textContent = `Editar: ${rule.name}`;
    modalBody.innerHTML = '';

    if (fields.length === 0) {
      modalBody.innerHTML =
        '<p>Esta regra não possui parâmetros editáveis.</p>';
    } else {
      const form = document.createElement('form');
      fields.forEach(field => {
        const parameter = mockData.parameters.find(
          p => p.rule_id === rule.id && p.field_id === field.id
        );
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        let inputHTML = '';
        if (field.type === 'boolean') {
          const isChecked =
            (parameter && parameter.value === 'true') ||
            (parameter && parameter.value === '1');
          inputHTML = `
            <label class="checkbox-label">
              <input type="checkbox" id="param-${field.id}" name="${
            field.slug
          }" ${isChecked ? 'checked' : ''} data-param-id="${
            parameter ? parameter.id : ''
          }" data-field-id="${field.id}">
              <span>${field.name}</span>
            </label>
            <button type="button" class="remove-field-btn" data-field-id="${
              field.id
            }">Remover campo</button>
          `;
        } else {
          inputHTML = `
            <label for="param-${field.id}">${field.name}</label>
            <input type="${field.type}" id="param-${field.id}" name="${
            field.slug
          }" value="${parameter ? parameter.value : ''}" data-param-id="${
            parameter ? parameter.id : ''
          }" data-field-id="${field.id}">
            <button type="button" class="remove-field-btn" data-field-id="${
              field.id
            }">Remover campo</button>
          `;
        }

        formGroup.innerHTML = inputHTML;
        form.appendChild(formGroup);
      });

      // Adicionar botão para criar novo campo
      const addFieldButton = document.createElement('button');
      addFieldButton.type = 'button';
      addFieldButton.className = 'btn-add-field';
      addFieldButton.textContent = '+ Adicionar campo';
      addFieldButton.onclick = () => showAddFieldForm(rule.id, template.id);
      form.appendChild(addFieldButton);

      modalBody.appendChild(form);
    }

    saveParamsBtn.onclick = () => saveParameters(ruleId);
    modal.style.display = 'block';

    // Adicionar listeners para remover campos
    addRemoveFieldListeners();
  }

  function closeModal() {
    modal.style.display = 'none';
  }

  function saveParameters(ruleId) {
    console.log(`Salvando parâmetros para a regra ID: ${ruleId}`);
    const inputs = modalBody.querySelectorAll('input[data-param-id]');
    inputs.forEach(input => {
      const paramId = parseInt(input.dataset.paramId, 10);
      let value;

      if (input.type === 'checkbox') {
        value = input.checked ? 'true' : 'false';
      } else {
        value = input.value;
      }

      if (paramId) {
        const parameter = mockData.parameters.find(p => p.id === paramId);
        if (parameter) {
          console.log(
            `Atualizando Parâmetro ID: ${paramId}, Novo Valor: ${value}`
          );
          parameter.value = value;
        }
      }
    });
    alert('Parâmetros salvos com sucesso!');
    closeModal();
  }

  function addDragAndDropListeners() {
    const items = ruleList.querySelectorAll('.rule-item');
    items.forEach(item => {
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('drop', handleDrop);
      item.addEventListener('dragend', handleDragEnd);
    });
  }

  function handleDragStart(e) {
    const ruleId = parseInt(this.dataset.id, 10);
    const rule = mockData.rules.find(r => r.id === ruleId);
    const template = mockData.templates.find(t => t.id === rule.template_id);

    if (template.terminator === 1) {
      e.preventDefault();
      alert(
        'Esta regra não pode ser reordenada pois possui um template com terminator ativado.'
      );
      return;
    }

    draggedItem = this;
    setTimeout(() => {
      this.classList.add('dragging');
    }, 0);
  }

  function handleDragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(ruleList, e.clientY);
    if (afterElement == null) {
      ruleList.appendChild(draggedItem);
    } else {
      ruleList.insertBefore(draggedItem, afterElement);
    }
    // Mostrar o botão salvar assim que houver movimento
    saveOrderBtn.classList.remove('hidden');
  }

  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll('.rule-item:not(.dragging)'),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  function handleDrop() {
    saveOrderBtn.classList.remove('hidden');
  }

  function handleDragEnd() {
    this.classList.remove('dragging');
  }

  function saveNewOrder() {
    const orderedIds = [...ruleList.querySelectorAll('.rule-item')].map(item =>
      parseInt(item.dataset.id, 10)
    );

    orderedIds.forEach((id, index) => {
      const rule = mockData.rules.find(r => r.id === id);
      if (rule) {
        rule.weight = index;
      }
    });

    console.log(
      'Nova ordem salva:',
      mockData.rules.filter(r => orderedIds.includes(r.id))
    );
    alert('Ordem salva com sucesso!');
    saveOrderBtn.classList.add('hidden');

    const activeRulesetId = parseInt(
      document.querySelector('#ruleset-list li.active').dataset.id,
      10
    );
    renderRules(activeRulesetId);
  }

  function addEditButtonListeners() {
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', e => {
        const ruleId = parseInt(e.currentTarget.dataset.ruleId, 10);
        openModal(ruleId);
      });
    });
  }

  function addDeleteButtonListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', e => {
        const ruleId = parseInt(e.currentTarget.dataset.ruleId, 10);
        deleteRule(ruleId);
      });
    });
  }

  function deleteRule(ruleId) {
    if (confirm('Tem certeza que deseja excluir esta regra?')) {
      const ruleIndex = mockData.rules.findIndex(r => r.id === ruleId);
      if (ruleIndex !== -1) {
        mockData.rules.splice(ruleIndex, 1);

        // Remover parâmetros associados à regra
        mockData.parameters = mockData.parameters.filter(
          p => p.rule_id !== ruleId
        );

        console.log(`Regra ID ${ruleId} removida com sucesso`);

        // Re-renderizar as regras
        const activeRulesetId = parseInt(
          document.querySelector('#ruleset-list li.active').dataset.id,
          10
        );
        renderRules(activeRulesetId);
      }
    }
  }

  function showAddFieldForm(ruleId, templateId) {
    const addFieldDiv = document.createElement('div');
    addFieldDiv.className = 'add-field-form';
    addFieldDiv.innerHTML = `
      <h4>Adicionar novo campo</h4>
      <div class="form-group">
        <label for="new-field-name">Nome do campo</label>
        <input type="text" id="new-field-name" placeholder="Ex: Novo parâmetro">
      </div>
      <div class="form-group">
        <label for="new-field-type">Tipo do campo</label>
        <select id="new-field-type">
          <option value="text">Texto</option>
          <option value="number">Número</option>
          <option value="boolean">Booleano</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-primary" id="confirm-add-field">Adicionar</button>
        <button type="button" class="btn-secondary" id="cancel-add-field">Cancelar</button>
      </div>
    `;

    modalBody.appendChild(addFieldDiv);

    document.getElementById('confirm-add-field').onclick = () => {
      const fieldName = document.getElementById('new-field-name').value;
      const fieldType = document.getElementById('new-field-type').value;

      if (!fieldName) {
        alert('Por favor, informe o nome do campo');
        return;
      }

      addNewField(ruleId, templateId, fieldName, fieldType);
    };

    document.getElementById('cancel-add-field').onclick = () => {
      addFieldDiv.remove();
    };
  }

  function addNewField(ruleId, templateId, fieldName, fieldType) {
    // Criar novo field
    const newFieldId = Math.max(...mockData.fields.map(f => f.id), 0) + 1;
    const fieldSlug = fieldName.toLowerCase().replace(/\s+/g, '-');

    const newField = {
      id: newFieldId,
      name: fieldName,
      slug: fieldSlug,
      type: fieldType,
      template_id: templateId,
    };

    mockData.fields.push(newField);

    // Criar novo parameter associado ao field e à rule
    const newParamId = Math.max(...mockData.parameters.map(p => p.id), 0) + 1;
    const defaultValue = fieldType === 'boolean' ? 'false' : '';

    const newParameter = {
      id: newParamId,
      value: defaultValue,
      rule_id: ruleId,
      field_id: newFieldId,
    };

    mockData.parameters.push(newParameter);

    console.log('Novo campo adicionado:', newField);
    console.log('Novo parâmetro criado:', newParameter);

    // Fechar modal e reabrir para mostrar o novo campo
    closeModal();
    setTimeout(() => openModal(ruleId), 100);
  }

  function addRemoveFieldListeners() {
    document.querySelectorAll('.remove-field-btn').forEach(button => {
      button.addEventListener('click', e => {
        const fieldId = parseInt(e.currentTarget.dataset.fieldId, 10);
        removeField(fieldId);
      });
    });
  }

  function removeField(fieldId) {
    if (
      confirm(
        'Tem certeza que deseja remover este campo? O parâmetro associado também será removido.'
      )
    ) {
      // Remover field
      const fieldIndex = mockData.fields.findIndex(f => f.id === fieldId);
      if (fieldIndex !== -1) {
        mockData.fields.splice(fieldIndex, 1);
      }

      // Remover parameters associados ao field
      mockData.parameters = mockData.parameters.filter(
        p => p.field_id !== fieldId
      );

      console.log(
        `Campo ID ${fieldId} e seus parâmetros removidos com sucesso`
      );

      // Reabrir o modal para atualizar a visualização
      const currentRuleId = getCurrentEditingRuleId();
      if (currentRuleId) {
        closeModal();
        setTimeout(() => openModal(currentRuleId), 100);
      }
    }
  }

  function getCurrentEditingRuleId() {
    const titleText = modalTitle.textContent;
    const match = titleText.match(/Editar: (.+)/);
    if (match) {
      const ruleName = match[1];
      const rule = mockData.rules.find(r => r.name === ruleName);
      return rule ? rule.id : null;
    }
    return null;
  }

  closeModalBtn.addEventListener('click', closeModal);
  window.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal();
    }
  });
  saveOrderBtn.addEventListener('click', saveNewOrder);

  renderRulesets();

  // Selecionar o conjunto "Orçamento" (id: 1) por padrão após renderização
  setTimeout(() => {
    const defaultRuleset = document.querySelector(
      '#ruleset-list li[data-id="1"]'
    );
    if (defaultRuleset) {
      const rulesetName = defaultRuleset.querySelector('.ruleset-name');
      if (rulesetName) {
        rulesetName.click();
      }
    } else if (rulesetList.firstChild) {
      const firstRulesetName =
        rulesetList.firstChild.querySelector('.ruleset-name');
      if (firstRulesetName) {
        firstRulesetName.click();
      }
    }
  }, 0);
});
