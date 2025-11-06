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
        name: 'Recuperação de Carrinho',
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
      li.textContent = ruleset.name;
      li.dataset.id = ruleset.id;
      li.addEventListener('click', () => {
        document
          .querySelectorAll('#ruleset-list li')
          .forEach(item => item.classList.remove('active'));
        li.classList.add('active');
        renderRules(ruleset.id);
      });
      rulesetList.appendChild(li);
    });
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
      li.draggable = true;

      const template = mockData.templates.find(t => t.id === rule.template_id);
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
        formGroup.innerHTML = `
                    <label for="param-${field.id}">${field.name}</label>
                    <input type="${field.type}" id="param-${field.id}" name="${
          field.slug
        }" value="${parameter ? parameter.value : ''}" data-param-id="${
          parameter ? parameter.id : ''
        }">
                `;
        form.appendChild(formGroup);
      });
      modalBody.appendChild(form);
    }

    saveParamsBtn.onclick = () => saveParameters(ruleId);
    modal.style.display = 'block';
  }

  function closeModal() {
    modal.style.display = 'none';
  }

  function saveParameters(ruleId) {
    console.log(`Salvando parâmetros para a regra ID: ${ruleId}`);
    const inputs = modalBody.querySelectorAll('input');
    inputs.forEach(input => {
      const paramId = parseInt(input.dataset.paramId, 10);
      const value = input.value;
      const parameter = mockData.parameters.find(p => p.id === paramId);
      if (parameter) {
        console.log(
          `Atualizando Parâmetro ID: ${paramId}, Novo Valor: ${value}`
        );
        parameter.value = value;
      }
    });
    alert('Parâmetros salvos com sucesso! (simulado)');
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
      'Nova ordem salva (simulado):',
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

  closeModalBtn.addEventListener('click', closeModal);
  window.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal();
    }
  });
  saveOrderBtn.addEventListener('click', saveNewOrder);

  renderRulesets();
  if (rulesetList.firstChild) {
    rulesetList.firstChild.click();
  }
});
