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

  let currentUserRole = null;
  let currentRules = [];
  let draggedItem = null;

  const roleSelectionScreen = document.getElementById('role-selection-screen');
  const mainApp = document.getElementById('main-app');
  const adminBtn = document.getElementById('admin-btn');
  const managerBtn = document.getElementById('manager-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userRoleDisplay = document.getElementById('user-role-display');

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
  const cancelModalBtn = document.getElementById('cancel-modal-btn');

  const confirmationModal = document.getElementById('confirmation-modal');
  const confirmationTitle = document.getElementById('confirmation-title');
  const confirmationMessage = document.getElementById('confirmation-message');
  const confirmYesBtn = document.getElementById('confirm-yes-btn');
  const confirmNoBtn = document.getElementById('confirm-no-btn');

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const rulesTab = document.getElementById('rules-tab');
  const templatesTab = document.getElementById('templates-tab');

  const createRulesetBtn = document.getElementById('create-ruleset-btn');
  const createRuleBtn = document.getElementById('create-rule-btn');
  const createTemplateBtn = document.getElementById('create-template-btn');
  const templateList = document.getElementById('template-list');

  function initRoleSelection() {
    adminBtn.addEventListener('click', () => selectRole('admin'));
    managerBtn.addEventListener('click', () => selectRole('manager'));
  }

  function selectRole(role) {
    currentUserRole = role;
    userRoleDisplay.textContent = role === 'admin' ? 'Administrador' : 'Gestor';
    roleSelectionScreen.style.display = 'none';
    mainApp.classList.remove('main-app-hidden');
    initializeApp();
  }

  function logout() {
    currentUserRole = null;
    roleSelectionScreen.style.display = 'flex';
    mainApp.classList.add('main-app-hidden');
    renderRulesets();
  }

  function canCreateRuleset() {
    return currentUserRole === 'admin';
  }

  function canEditRuleset() {
    return currentUserRole === 'admin';
  }

  function canDeleteRuleset() {
    return currentUserRole === 'admin';
  }

  function canCreateRule() {
    return currentUserRole === 'admin';
  }

  function canEditRule() {
    return currentUserRole === 'admin';
  }

  function canDeleteRule() {
    return currentUserRole === 'admin';
  }

  function canEditParameter() {
    return true;
  }

  function canReorderRules() {
    return currentUserRole === 'admin' || currentUserRole === 'manager';
  }

  function canManageTemplates() {
    return currentUserRole === 'admin';
  }

  function canToggleRule() {
    // Gestor também pode ativar/desativar regra
    return currentUserRole === 'admin' || currentUserRole === 'manager';
  }

  function updateUIPermissions() {
    const isAdmin = currentUserRole === 'admin';
    const isManager = currentUserRole === 'manager';

    if (isManager) {
      templatesTab.classList.add('tab-hidden');
      const templatesTabBtn = document.querySelector(
        '.tab-btn[data-tab="templates"]'
      );
      if (templatesTabBtn) templatesTabBtn.style.display = 'none';
    }

    if (isAdmin) {
      templatesTab.classList.remove('tab-hidden');
      const templatesTabBtn = document.querySelector(
        '.tab-btn[data-tab="templates"]'
      );
      if (templatesTabBtn) templatesTabBtn.style.display = '';
    }

    const actionButtons = document.querySelectorAll('.btn-action-hidden');
    actionButtons.forEach(btn => {
      btn.style.display = isAdmin ? 'block' : 'none';
    });
  }

  function initializeApp() {
    updateUIPermissions();
    renderRulesets();
    renderTemplates();

    tabButtons.forEach(btn => btn.classList.remove('active'));
    const rulesTabBtn = document.querySelector('.tab-btn[data-tab="rules"]');
    if (rulesTabBtn) rulesTabBtn.classList.add('active');
    tabContents.forEach(content => content.classList.remove('active'));
    rulesTab.classList.add('active');

    document
      .querySelectorAll('#ruleset-list li')
      .forEach(item => item.classList.remove('active'));
    currentRulesetName.textContent = 'Selecione um conjunto';
    currentRulesetDescription.textContent = '';
    ruleList.innerHTML = '';
    saveOrderBtn.classList.add('hidden');
    saveOrderBtn.disabled = true;
  }

  function renderRulesets() {
    rulesetList.innerHTML = '';
    mockData.rulesets.forEach(ruleset => {
      const li = document.createElement('li');
      li.dataset.id = ruleset.id;

      let actionButtons = '';
      if (canEditRuleset() || canDeleteRuleset()) {
        actionButtons = `<div class="ruleset-actions">`;
        if (canEditRuleset()) {
          actionButtons += `<button class="edit-ruleset-btn" data-ruleset-id="${ruleset.id}" title="Editar">✏️</button>`;
        }
        if (canDeleteRuleset()) {
          actionButtons += `<button class="delete-ruleset-btn" data-ruleset-id="${ruleset.id}" title="Excluir">🗑️</button>`;
        }
        actionButtons += '</div>';
      }

      li.innerHTML = `
        <span class="ruleset-name">${ruleset.name}</span>
        ${actionButtons}
      `;

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

    addRulesetListeners();
  }

  function addRulesetListeners() {
    document.querySelectorAll('.edit-ruleset-btn').forEach(button => {
      button.addEventListener('click', e => {
        e.stopPropagation();
        const rulesetId = parseInt(e.currentTarget.dataset.rulesetId, 10);
        openEditRulesetModal(rulesetId);
      });
    });

    document.querySelectorAll('.delete-ruleset-btn').forEach(button => {
      button.addEventListener('click', e => {
        e.stopPropagation();
        const rulesetId = parseInt(e.currentTarget.dataset.rulesetId, 10);
        openConfirmationDialog(
          'Excluir Conjunto de Regras',
          'Tem certeza que deseja excluir este conjunto de regras?',
          () => deleteRuleset(rulesetId)
        );
      });
    });
  }

  function openEditRulesetModal(rulesetId) {
    const ruleset = mockData.rulesets.find(rs => rs.id === rulesetId);
    modalTitle.textContent = 'Editar Conjunto de Regras';
    modalBody.innerHTML = `
      <form id="ruleset-form">
        <div class="form-group">
          <label for="ruleset-name">Nome</label>
          <input type="text" id="ruleset-name" name="name" value="${ruleset.name}" required>
        </div>
        <div class="form-group">
          <label>Slug</label>
          <input type="text" value="${ruleset.slug}" disabled>
        </div>
        <div class="form-group">
          <label for="ruleset-description">Descrição</label>
          <textarea id="ruleset-description" name="description">${ruleset.description}</textarea>
        </div>
      </form>
    `;
    saveParamsBtn.onclick = () => {
      const form = document.getElementById('ruleset-form');
      const formData = new FormData(form);
      ruleset.name = formData.get('name');
      ruleset.description = formData.get('description');
      closeModal();
      renderRulesets();
      const activeRuleset = document.querySelector('#ruleset-list li.active');
      if (activeRuleset && parseInt(activeRuleset.dataset.id) === rulesetId) {
        activeRuleset.click();
      }
    };
    modal.style.display = 'block';
  }

  function openCreateRulesetModal() {
    modalTitle.textContent = 'Criar Novo Conjunto de Regras';
    modalBody.innerHTML = `
      <form id="new-ruleset-form">
        <div class="form-group">
          <label for="new-ruleset-name">Nome</label>
          <input type="text" id="new-ruleset-name" name="name" required>
        </div>
        <div class="form-group">
          <label for="new-ruleset-slug">Slug (opcional)</label>
          <input type="text" id="new-ruleset-slug" name="slug" placeholder="ex: cart-recovery">
        </div>
        <div class="form-group">
          <label for="new-ruleset-description">Descrição</label>
          <textarea id="new-ruleset-description" name="description"></textarea>
        </div>
      </form>
    `;
    saveParamsBtn.onclick = () => {
      const form = document.getElementById('new-ruleset-form');
      const formData = new FormData(form);
      const name = formData.get('name');
      const description = formData.get('description');

      if (!name.trim()) {
        alert('Por favor, informe o nome');
        return;
      }

      const newId = Math.max(...mockData.rulesets.map(r => r.id), 0) + 1;
      const providedSlug = document
        .getElementById('new-ruleset-slug')
        .value.trim();
      mockData.rulesets.push({
        id: newId,
        name: name.trim(),
        slug: providedSlug || name.toLowerCase().replace(/\s+/g, '-'),
        description: description.trim(),
      });

      closeModal();
      renderRulesets();
    };
    modal.style.display = 'block';
  }

  function deleteRuleset(rulesetId) {
    const activeRulesetId = parseInt(
      document.querySelector('#ruleset-list li.active')?.dataset.id,
      10
    );
    const removedIsActive = activeRulesetId === rulesetId;

    const index = mockData.rulesets.findIndex(r => r.id === rulesetId);
    if (index !== -1) {
      mockData.rulesets.splice(index, 1);
      mockData.rules = mockData.rules.filter(r => r.ruleset_id !== rulesetId);
      renderRulesets();

      if (removedIsActive) {
        document
          .querySelectorAll('#ruleset-list li')
          .forEach(item => item.classList.remove('active'));
        currentRulesetName.textContent = 'Selecione um conjunto';
        currentRulesetDescription.textContent = '';
        ruleList.innerHTML = '';
        saveOrderBtn.classList.add('hidden');
        saveOrderBtn.disabled = true;
      }
    }
  }

  function renderRules(rulesetId) {
    const ruleset = mockData.rulesets.find(rs => rs.id === rulesetId);
    if (!ruleset) return;

    currentRulesetName.textContent = ruleset.name;
    currentRulesetDescription.textContent = ruleset.description;

    saveOrderBtn.disabled = true;
    saveOrderBtn.classList.add('hidden');

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

      li.draggable = canReorderRules();

      const hasParams = mockData.fields.some(
        f => f.template_id === template.id
      );

      let actionButtons = '';
      if (canEditRule()) {
        actionButtons += `<button class="edit-btn" data-rule-id="${rule.id}" title="Editar Regra">✏️</button>`;
      }
      if (canEditParameter()) {
        // Admin não edita mais parâmetros aqui; gestor pode editar valores se houver params
        if (currentUserRole === 'manager' && hasParams) {
          actionButtons += `<button class="edit-btn edit-params-btn" data-rule-id="${rule.id}" title="Editar Parâmetros">📝</button>`;
        }
      }
      if (canDeleteRule()) {
        actionButtons += `<button class="delete-btn" data-rule-id="${rule.id}" title="Excluir Regra">🗑️</button>`;
      }

      // Mostra toggle inline somente para gestor (admin controla no modal)
      const toggleMarkup =
        currentUserRole === 'manager' && canToggleRule()
          ? `<label class="switch">
            <input type="checkbox" ${
              rule.enabled ? 'checked' : ''
            } data-rule-id="${rule.id}">
            <span class="slider"></span>
          </label>`
          : '';

      li.innerHTML = `
        <div class="rule-info">
          <h4>${rule.name}</h4>
          <p>${rule.description}</p>
        </div>
        <div class="rule-actions">
          ${actionButtons}
          ${toggleMarkup}
        </div>
      `;

      ruleList.appendChild(li);
    });

    if (canReorderRules()) {
      addDragAndDropListeners();
    }
    addRuleActionListeners();
  }

  function addRuleActionListeners() {
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', e => {
        const ruleId = parseInt(e.currentTarget.dataset.ruleId, 10);
        openEditRuleModal(ruleId);
      });
    });

    document.querySelectorAll('.edit-params-btn').forEach(button => {
      button.addEventListener('click', e => {
        const ruleId = parseInt(e.currentTarget.dataset.ruleId, 10);
        openEditParametersModal(ruleId);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', e => {
        const ruleId = parseInt(e.currentTarget.dataset.ruleId, 10);
        openConfirmationDialog(
          'Excluir Regra',
          'Tem certeza que deseja excluir esta regra?',
          () => deleteRule(ruleId)
        );
      });
    });

    document.querySelectorAll('.switch input').forEach(checkbox => {
      checkbox.addEventListener('change', e => {
        const ruleId = parseInt(e.currentTarget.dataset.ruleId, 10);
        const rule = mockData.rules.find(r => r.id === ruleId);
        if (rule) {
          rule.enabled = e.currentTarget.checked ? 1 : 0;
        }
      });
    });
  }

  function openEditRuleModal(ruleId) {
    const rule = mockData.rules.find(r => r.id === ruleId);

    modalTitle.textContent = `Editar Regra: ${rule.name}`;
    modalBody.innerHTML = `
      <form id="edit-rule-form">
        <div class="form-group">
          <label for="rule-name">Nome</label>
          <input type="text" id="rule-name" name="name" value="${rule.name}" required>
        </div>
        <div class="form-group">
          <label for="rule-description">Descrição</label>
          <textarea id="rule-description" name="description">${rule.description}</textarea>
        </div>
      </form>
    `;

    saveParamsBtn.textContent = 'Salvar';
    saveParamsBtn.onclick = () => {
      const form = document.getElementById('edit-rule-form');
      const formData = new FormData(form);
      rule.name = formData.get('name');
      rule.description = formData.get('description');
      closeModal();
      const activeRulesetId = parseInt(
        document.querySelector('#ruleset-list li.active')?.dataset.id,
        10
      );
      renderRules(activeRulesetId);
    };
    modal.style.display = 'block';
  }

  function openEditParametersModal(ruleId) {
    const rule = mockData.rules.find(r => r.id === ruleId);
    const template = mockData.templates.find(t => t.id === rule.template_id);
    const fields = mockData.fields.filter(f => f.template_id === template.id);

    modalTitle.textContent = `Editar Parâmetros: ${rule.name}`;
    modalBody.innerHTML = '';

    const form = document.createElement('form');
    if (fields.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'Esta regra não possui parâmetros ainda.';
      form.appendChild(p);
    }

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
          `;
      } else {
        inputHTML = `
            <label for="param-${field.id}">${field.name}</label>
            <input type="${field.type}" id="param-${field.id}" name="${
          field.slug
        }" value="${parameter ? parameter.value : ''}" data-param-id="${
          parameter ? parameter.id : ''
        }" data-field-id="${field.id}">
          `;
      }

      formGroup.innerHTML = inputHTML;

      // Remoção de campo não ocorre mais aqui.

      form.appendChild(formGroup);
    });

    // Adição de campo não ocorre mais aqui.

    modalBody.appendChild(form);

    saveParamsBtn.textContent = 'Salvar';
    saveParamsBtn.onclick = () => saveParameters(ruleId);
    modal.style.display = 'block';
  }

  function saveParameters(ruleId) {
    const inputs = modalBody.querySelectorAll('input[data-param-id]');

    const rule = mockData.rules.find(r => r.id === ruleId);
    const template = rule
      ? mockData.templates.find(t => t.id === rule.template_id)
      : null;
    const isCartRecoverySplitRule =
      (rule && rule.name === 'Segmenta recuperador carrinho') ||
      (template && template.id === 11);

    if (isCartRecoverySplitRule) {
      const allowedSplitSlugs = new Set([
        'cart-recovery-split',
        'phone-recovery-split',
        'zendesk-split',
      ]);
      let total = 0;
      inputs.forEach(input => {
        const fieldId = parseInt(input.dataset.fieldId, 10);
        const field = mockData.fields.find(f => f.id === fieldId);
        if (field && allowedSplitSlugs.has(field.slug)) {
          const n = parseFloat(
            input.type === 'checkbox'
              ? input.checked
                ? '1'
                : '0'
              : input.value.replace(',', '.')
          );
          if (!isNaN(n)) total += n;
        }
      });
      if (total > 100) {
        alert(
          'A soma dos percentuais não pode ser maior que 100%. Ajuste os valores.'
        );
        return;
      }
    }
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
          parameter.value = value;
        }
      }
    });
    closeModal();
  }

  function deleteField(fieldId, templateId, ruleId) {
    const fieldIndex = mockData.fields.findIndex(f => f.id === fieldId);
    if (fieldIndex !== -1) {
      mockData.fields.splice(fieldIndex, 1);
    }
    mockData.parameters = mockData.parameters.filter(
      p => p.field_id !== fieldId
    );
    closeModal();
    setTimeout(() => openEditParametersModal(ruleId), 100);
  }

  function deleteRule(ruleId) {
    const index = mockData.rules.findIndex(r => r.id === ruleId);
    if (index !== -1) {
      mockData.rules.splice(index, 1);
      mockData.parameters = mockData.parameters.filter(
        p => p.rule_id !== ruleId
      );

      const activeRulesetId = parseInt(
        document.querySelector('#ruleset-list li.active')?.dataset.id,
        10
      );
      renderRules(activeRulesetId);
    }
  }

  function openCreateRuleModal() {
    const activeRulesetId = parseInt(
      document.querySelector('#ruleset-list li.active')?.dataset.id,
      10
    );
    if (!activeRulesetId) {
      alert('Por favor, selecione um conjunto de regras primeiro');
      return;
    }

    modalTitle.textContent = 'Criar Nova Regra';
    const templateOptions = mockData.templates
      .map(t => `<option value="${t.id}">${t.name}</option>`)
      .join('');

    modalBody.innerHTML = `
      <form id="new-rule-form">
        <div class="form-group">
          <label for="new-rule-name">Nome</label>
          <input type="text" id="new-rule-name" name="name" required>
        </div>
        <div class="form-group">
          <label for="new-rule-description">Descrição</label>
          <textarea id="new-rule-description" name="description"></textarea>
        </div>
        <div class="form-group">
          <label for="new-rule-template">Template</label>
          <select id="new-rule-template" name="template_id" required>
            <option value="">Selecione um template</option>
            ${templateOptions}
          </select>
        </div>
      </form>
    `;

    saveParamsBtn.textContent = 'Criar';
    saveParamsBtn.onclick = () => {
      const form = document.getElementById('new-rule-form');
      const formData = new FormData(form);
      const name = formData.get('name');
      const description = formData.get('description');
      const templateId = parseInt(formData.get('template_id'), 10);

      if (!name.trim() || !templateId) {
        alert('Por favor, preencha todos os campos');
        return;
      }

      const newId = Math.max(...mockData.rules.map(r => r.id), 0) + 1;
      const maxWeight = Math.max(
        ...mockData.rules
          .filter(r => r.ruleset_id === activeRulesetId)
          .map(r => r.weight),
        -1
      );

      mockData.rules.push({
        id: newId,
        name: name.trim(),
        description: description.trim(),
        weight: maxWeight + 1,
        enabled: document.getElementById('new-rule-enabled').checked ? 1 : 0,
        ruleset_id: activeRulesetId,
        template_id: templateId,
      });

      closeModal();
      renderRules(activeRulesetId);
    };

    modal.style.display = 'block';
  }

  function showAddFieldForm(ruleId, templateId) {
    // Função obsoleta: gestão de campos migrou para o template.
  }

  function addNewField(ruleId, templateId, fieldName, fieldType) {
    // Função obsoleta: adicionar fields via modal de template.
  }

  function renderTemplates() {
    if (currentUserRole === 'manager') {
      templateList.innerHTML = '';
      return;
    }

    templateList.innerHTML = '';
    mockData.templates.forEach(template => {
      const li = document.createElement('li');
      li.className = 'template-item';
      li.dataset.id = template.id;

      li.innerHTML = `
        <div class="template-info">
          <h4>${template.name}</h4>
          <p>Slug: ${template.slug}</p>
          <p>Terminator: ${template.terminator === 1 ? 'Sim' : 'Não'}</p>
        </div>
        <div class="template-actions">
          <button class="edit-btn edit-template-btn" data-template-id="${
            template.id
          }" title="Editar">Editar</button>
          <button class="delete-btn delete-template-btn" data-template-id="${
            template.id
          }" title="Excluir">Excluir</button>
        </div>
      `;

      templateList.appendChild(li);
    });

    addTemplateListeners();
  }

  function addTemplateListeners() {
    document.querySelectorAll('.edit-template-btn').forEach(button => {
      button.addEventListener('click', e => {
        e.stopPropagation();
        const templateId = parseInt(e.currentTarget.dataset.templateId, 10);
        openEditTemplateModal(templateId);
      });
    });

    document.querySelectorAll('.delete-template-btn').forEach(button => {
      button.addEventListener('click', e => {
        e.stopPropagation();
        const templateId = parseInt(e.currentTarget.dataset.templateId, 10);
        openConfirmationDialog(
          'Excluir Template',
          'Tem certeza que deseja excluir este template?',
          () => deleteTemplate(templateId)
        );
      });
    });
  }

  function openEditTemplateModal(templateId) {
    const template = mockData.templates.find(t => t.id === templateId);
    modalTitle.textContent = 'Editar Template';
    const templateFields = mockData.fields.filter(
      f => f.template_id === template.id
    );
    const isAdmin = currentUserRole === 'admin';
    const fieldsTableRows = templateFields
      .map(
        f => `<tr data-field-id="${f.id}">
          <td>${f.name}</td>
          <td>${f.slug}</td>
          <td>${f.type}</td>
          <td>
            ${
              isAdmin
                ? `<button type="button" class="edit-field-btn" data-field-id="${f.id}" title="Editar">✏️</button>
                   <button type="button" class="delete-field-btn" data-field-id="${f.id}" title="Remover">🗑️</button>`
                : ''
            }
          </td>
        </tr>`
      )
      .join('');

    modalBody.innerHTML = `
      <form id="edit-template-form">
        <div class="form-group">
          <label for="template-name">Nome</label>
          <input type="text" id="template-name" name="name" value="${
            template.name
          }" required>
        </div>
        <div class="form-group">
          <label>Slug</label>
          <input type="text" value="${template.slug}" disabled>
        </div>
        <div class="form-group">
          <label for="template-terminator" class="checkbox-label">
            <input type="checkbox" id="template-terminator" name="terminator" ${
              template.terminator === 1 ? 'checked' : ''
            }>
            <span>Terminator</span>
          </label>
        </div>
        <div class="form-group">
          <label>Campos (Fields)</label>
          <table class="fields-table">
            <thead>
              <tr><th>Nome</th><th>Slug</th><th>Tipo</th><th>Ações</th></tr>
            </thead>
            <tbody>
              ${
                fieldsTableRows ||
                '<tr><td colspan="4">Nenhum campo vinculado</td></tr>'
              }
            </tbody>
          </table>
        </div>
        ${
          isAdmin
            ? `
        <div class="form-group">
          <button type="button" class="btn-primary" id="add-field-btn">+ Adicionar Novo Campo</button>
        </div>`
            : ''
        }
      </form>
    `;

    saveParamsBtn.textContent = 'Salvar';
    saveParamsBtn.onclick = () => {
      const form = document.getElementById('edit-template-form');
      const formData = new FormData(form);
      template.name = formData.get('name');
      const markAsTerminator = document.getElementById(
        'template-terminator'
      ).checked;
      if (markAsTerminator) {
        mockData.templates.forEach(t => (t.terminator = 0));
        template.terminator = 1;
      } else {
        template.terminator = 0;
      }
      closeModal();
      renderTemplates();
    };
    modal.style.display = 'block';

    if (isAdmin) {
      modalBody.querySelectorAll('.edit-field-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          const fieldId = parseInt(e.currentTarget.dataset.fieldId, 10);
          openEditFieldModal(templateId, fieldId);
        });
      });

      modalBody.querySelectorAll('.delete-field-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          const fieldId = parseInt(e.currentTarget.dataset.fieldId, 10);
          mockData.parameters = mockData.parameters.filter(
            p => p.field_id !== fieldId
          );
          mockData.fields = mockData.fields.filter(f => f.id !== fieldId);
          openEditTemplateModal(templateId);
        });
      });

      const addFieldBtn = document.getElementById('add-field-btn');
      if (addFieldBtn) {
        addFieldBtn.addEventListener('click', () => {
          openAddFieldModal(templateId);
        });
      }
    }
  }

  function openAddFieldModal(templateId) {
    const template = mockData.templates.find(t => t.id === templateId);

    // Criar um segundo modal para não interferir com o modal do template
    const fieldModalHtml = `
      <div id="field-modal" class="modal" style="display: block;">
        <div class="modal-content">
          <header class="modal-header">
            <h3>Adicionar Novo Campo</h3>
            <span class="close-button-field">&times;</span>
          </header>
          <div class="modal-body">
            <form id="add-field-form">
              <div class="form-group">
                <label for="field-name">Nome</label>
                <input type="text" id="field-name" placeholder="Ex: Valor mínimo" required>
              </div>
              <div class="form-group">
                <label for="field-slug">Slug (opcional)</label>
                <input type="text" id="field-slug" placeholder="Ex: minimum-value">
              </div>
              <div class="form-group">
                <label for="field-type">Tipo</label>
                <select id="field-type">
                  <option value="text">Texto</option>
                  <option value="number">Número</option>
                  <option value="boolean">Booleano</option>
                </select>
              </div>
            </form>
          </div>
          <footer class="modal-footer">
            <button id="save-field-btn" class="btn-primary">Salvar</button>
            <button id="cancel-field-btn" class="btn-secondary">Cancelar</button>
          </footer>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', fieldModalHtml);
    const fieldModal = document.getElementById('field-modal');
    const closeBtn = fieldModal.querySelector('.close-button-field');
    const saveBtn = document.getElementById('save-field-btn');
    const cancelBtn = document.getElementById('cancel-field-btn');

    const closeFieldModal = () => {
      fieldModal.remove();
    };

    closeBtn.addEventListener('click', closeFieldModal);
    cancelBtn.addEventListener('click', closeFieldModal);

    saveBtn.addEventListener('click', () => {
      const fieldName = document.getElementById('field-name').value.trim();
      const fieldSlugInput = document.getElementById('field-slug').value.trim();
      const fieldType = document.getElementById('field-type').value;

      if (!fieldName) {
        alert('Informe o nome do campo');
        return;
      }

      const newFieldId = Math.max(...mockData.fields.map(f => f.id), 0) + 1;
      const slugCandidate =
        fieldSlugInput || fieldName.toLowerCase().replace(/\s+/g, '-');

      mockData.fields.push({
        id: newFieldId,
        name: fieldName,
        slug: slugCandidate,
        type: fieldType,
        template_id: template.id,
      });

      // Cria parâmetros default para cada regra existente que utiliza o template
      mockData.rules
        .filter(r => r.template_id === template.id)
        .forEach(r => {
          const newParamId =
            Math.max(...mockData.parameters.map(p => p.id), 0) + 1;
          mockData.parameters.push({
            id: newParamId,
            value: fieldType === 'boolean' ? 'false' : '',
            rule_id: r.id,
            field_id: newFieldId,
          });
        });

      closeFieldModal();
      openEditTemplateModal(templateId);
    });

    fieldModal.addEventListener('click', e => {
      if (e.target === fieldModal) {
        closeFieldModal();
      }
    });
  }

  function openEditFieldModal(templateId, fieldId) {
    const field = mockData.fields.find(f => f.id === fieldId);
    if (!field) return;

    const fieldModalHtml = `
      <div id="field-modal" class="modal" style="display: block;">
        <div class="modal-content">
          <header class="modal-header">
            <h3>Editar Campo</h3>
            <span class="close-button-field">&times;</span>
          </header>
          <div class="modal-body">
            <form id="edit-field-form">
              <div class="form-group">
                <label for="field-name">Nome</label>
                <input type="text" id="field-name" value="${
                  field.name
                }" required>
              </div>
              <div class="form-group">
                <label for="field-slug">Slug</label>
                <input type="text" id="field-slug" value="${field.slug}">
              </div>
              <div class="form-group">
                <label for="field-type">Tipo</label>
                <select id="field-type">
                  <option value="text" ${
                    field.type === 'text' ? 'selected' : ''
                  }>Texto</option>
                  <option value="number" ${
                    field.type === 'number' ? 'selected' : ''
                  }>Número</option>
                  <option value="boolean" ${
                    field.type === 'boolean' ? 'selected' : ''
                  }>Booleano</option>
                </select>
              </div>
            </form>
          </div>
          <footer class="modal-footer">
            <button id="save-field-btn" class="btn-primary">Salvar</button>
            <button id="cancel-field-btn" class="btn-secondary">Cancelar</button>
          </footer>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', fieldModalHtml);
    const fieldModal = document.getElementById('field-modal');
    const closeBtn = fieldModal.querySelector('.close-button-field');
    const saveBtn = document.getElementById('save-field-btn');
    const cancelBtn = document.getElementById('cancel-field-btn');

    const closeFieldModal = () => {
      fieldModal.remove();
    };

    closeBtn.addEventListener('click', closeFieldModal);
    cancelBtn.addEventListener('click', closeFieldModal);

    saveBtn.addEventListener('click', () => {
      const fieldName = document.getElementById('field-name').value.trim();
      const fieldSlug = document.getElementById('field-slug').value.trim();
      const fieldType = document.getElementById('field-type').value;

      if (!fieldName) {
        alert('Informe o nome do campo');
        return;
      }

      field.name = fieldName;
      field.slug = fieldSlug || fieldName.toLowerCase().replace(/\s+/g, '-');
      field.type = fieldType;

      closeFieldModal();
      openEditTemplateModal(templateId);
    });

    fieldModal.addEventListener('click', e => {
      if (e.target === fieldModal) {
        closeFieldModal();
      }
    });
  }

  function openCreateTemplateModal() {
    modalTitle.textContent = 'Criar Novo Template';
    modalBody.innerHTML = `
      <form id="new-template-form">
        <div class="form-group">
          <label for="new-template-name">Nome</label>
          <input type="text" id="new-template-name" name="name" required>
        </div>
        <div class="form-group">
          <label for="new-template-slug">Slug (opcional)</label>
          <input type="text" id="new-template-slug" name="slug" placeholder="ex: save-opportunity">
        </div>
        <div class="form-group">
          <label for="new-template-terminator" class="checkbox-label">
            <input type="checkbox" id="new-template-terminator" name="terminator">
            <span>Terminator</span>
          </label>
        </div>
      </form>
    `;

    saveParamsBtn.textContent = 'Criar';
    saveParamsBtn.onclick = () => {
      const form = document.getElementById('new-template-form');
      const formData = new FormData(form);
      const name = formData.get('name');

      if (!name.trim()) {
        alert('Por favor, informe o nome');
        return;
      }

      const newId = Math.max(...mockData.templates.map(t => t.id), 0) + 1;
      const isTerminator = document.getElementById(
        'new-template-terminator'
      ).checked;
      if (isTerminator) {
        mockData.templates.forEach(t => (t.terminator = 0));
      }
      const providedSlug = document
        .getElementById('new-template-slug')
        .value.trim();
      mockData.templates.push({
        id: newId,
        name: name.trim(),
        slug: providedSlug || name.toLowerCase().replace(/\s+/g, '-'),
        terminator: isTerminator ? 1 : 0,
      });

      closeModal();
      renderTemplates();
    };
    modal.style.display = 'block';
  }

  function deleteTemplate(templateId) {
    const index = mockData.templates.findIndex(t => t.id === templateId);
    if (index !== -1) {
      const rulesToRemove = mockData.rules
        .filter(r => r.template_id === templateId)
        .map(r => r.id);
      mockData.rules = mockData.rules.filter(r => r.template_id !== templateId);
      mockData.parameters = mockData.parameters.filter(
        p => !rulesToRemove.includes(p.rule_id)
      );

      mockData.templates.splice(index, 1);
      renderTemplates();

      const activeRulesetId = parseInt(
        document.querySelector('#ruleset-list li.active')?.dataset.id,
        10
      );
      if (activeRulesetId) {
        renderRules(activeRulesetId);
      }
    }
  }

  let isReordering = false;

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
    isReordering = true;
    saveOrderBtn.disabled = false;
    saveOrderBtn.classList.remove('hidden');
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
    isReordering = true;
    saveOrderBtn.disabled = false;
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
    isReordering = true;
    saveOrderBtn.disabled = false;
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

    const activeRulesetId = parseInt(
      document.querySelector('#ruleset-list li.active')?.dataset.id,
      10
    );
    const rulesInSet = mockData.rules
      .filter(r => r.ruleset_id === activeRulesetId)
      .sort((a, b) => a.weight - b.weight);

    if (rulesInSet.length > 0) {
      const lastRule = rulesInSet[rulesInSet.length - 1];
      const lastTemplate = mockData.templates.find(
        t => t.id === lastRule.template_id
      );
      const templateIdsInSet = new Set(rulesInSet.map(r => r.template_id));
      mockData.templates.forEach(t => {
        if (templateIdsInSet.has(t.id)) t.terminator = 0;
      });
      if (lastTemplate) lastTemplate.terminator = 1;
    }

    isReordering = false;
    saveOrderBtn.disabled = true;
    saveOrderBtn.classList.add('hidden');
    renderRules(activeRulesetId);
  }

  function closeModal() {
    modal.style.display = 'none';
    modalBody.innerHTML = '';
    saveParamsBtn.textContent = 'Salvar';
  }

  function openConfirmationDialog(title, message, callback) {
    confirmationTitle.textContent = title;
    confirmationMessage.textContent = message;
    confirmYesBtn.onclick = () => {
      callback();
      closeConfirmationDialog();
    };
    confirmationModal.style.display = 'block';
  }

  function closeConfirmationDialog() {
    confirmationModal.style.display = 'none';
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;

      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      tabContents.forEach(content => content.classList.remove('active'));

      if (tabName === 'rules') {
        rulesTab.classList.add('active');
      } else if (tabName === 'templates') {
        templatesTab.classList.add('active');
      }
    });
  });

  logoutBtn.addEventListener('click', logout);

  createRulesetBtn.addEventListener('click', () => {
    if (canCreateRuleset()) {
      openCreateRulesetModal();
    }
  });

  createRuleBtn.addEventListener('click', () => {
    if (canCreateRule()) {
      openCreateRuleModal();
    }
  });

  createTemplateBtn.addEventListener('click', () => {
    if (canManageTemplates()) {
      openCreateTemplateModal();
    }
  });

  saveOrderBtn.addEventListener('click', saveNewOrder);

  closeModalBtn.addEventListener('click', closeModal);
  cancelModalBtn.addEventListener('click', closeModal);

  window.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal();
    }
    if (event.target === confirmationModal) {
      closeConfirmationDialog();
    }
  });

  confirmNoBtn.addEventListener('click', closeConfirmationDialog);

  const confirmationCloseBtn = confirmationModal.querySelector('.close-button');
  confirmationCloseBtn.addEventListener('click', closeConfirmationDialog);

  initRoleSelection();
});
