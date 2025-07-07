 
document.addEventListener('DOMContentLoaded', function () {
    const cepInput = document.getElementById('cep');
    const clearButton = document.getElementById('clearButton');
    const submitButton = document.getElementById('submitButton');
    const addressForm = document.getElementById('addressForm');
    const addressList = document.getElementById('addressList');
    const search = document.getElementById("searchInput");
    // Carrega endereços salvos ao iniciar
    loadSavedAddresses();

    // Função para buscar o endereço via CEP
    async function fetchAddress(cep) {
        cep = cep.replace(/\D/g, '');

        if (cep.length !== 8) {
            alert('CEP deve conter 8 dígitos');
            return;
        }

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                alert('CEP não encontrado');
                return;
            }

            document.getElementById('logradouro').value = data.logradouro || '';
            document.getElementById('bairro').value = data.bairro || '';
            document.getElementById('localidade').value = data.localidade || '';
            document.getElementById('uf').value = data.uf || '';

        } catch (error) {
            alert('Erro ao buscar o CEP. Tente novamente.');
            console.error('Erro:', error);
        }
    }

    // Quando sair do campo CEP
    cepInput.addEventListener('blur', function () {
        if (this.value.trim() !== '') {
            fetchAddress(this.value);
        }
    });

    // Enter no campo CEP
    cepInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.value.trim() !== '') {
                fetchAddress(this.value);
            }
        }
    });

    // Apenas números no CEP
    cepInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '');
    });

    // Limpar formulário
    clearButton.addEventListener('click', function () {
        addressForm.reset();
    });

    // Salvar endereço
    submitButton.addEventListener('click', function () {
        
        saveAddress();
    });

    // Função para salvar o endereço no localStorage
    function saveAddress() {
        const nome = document.getElementById('nome').value.trim();
        const cep = document.getElementById('cep').value.trim();
        document.getElementById("email").validity.valid
        if (!nome || !cep) {
            alert('Por favor, preencha pelo menos o nome e o CEP');
            return;
        }

        const addressData = {
            nome: nome,
            email: email,
            cep: cep,
            logradouro: document.getElementById('logradouro').value,
            numero: document.getElementById('numero').value,
            bairro: document.getElementById('bairro').value,
            localidade: document.getElementById('localidade').value,
            uf: document.getElementById('uf').value
        };

        // Recupera endereços existentes ou cria um array vazio
        let savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];

        // Adiciona o novo endereço
        savedAddresses.push(addressData);

        // Salva no localStorage
        localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));

        // Atualiza a lista exibida
        loadSavedAddresses();

        // Limpa o formulário
        addressForm.reset();

        alert('Endereço salvo com sucesso!');
    }

    search.addEventListener('blur', function () {
        if (this.value.trim() !== '') {
            filter();
        }else{
            loadSavedAddresses();
        }
    });

    function filter(){
        var searchQuery = document.getElementById('searchInput').value;
        const savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')).filter(savedAddresses => savedAddresses.nome.startsWith(searchQuery)) || [];
        addressList.innerHTML = '';

        if (savedAddresses.length === 0) {
            addressList.innerHTML = '<p class="text-center">Nenhum endereço salvo ainda.</p>';
            return;
        }


        savedAddresses.forEach((address, index) => {
            const card = document.createElement('div');
            card.className = 'col-md-6 mb-3';
            card.innerHTML = `
                        <div class="card address-card">
                            <div class="card-body">
                                <h5 class="card-title mb-0">${address.nome}</h5>
                                <p class="card-text"><strong>Email:</strong> ${address.email}</p>
                                <p class="card-text"> ${address.logradouro || 'N/A'}, N° ${address.numero || 'N/A'},</p>
                                <p class="card-text"> ${address.bairro || 'N/A'}, ${address.cidade || 'N/A'} - ${address.uf || 'N/A'}</p>
                                <p class="small class="text-muted">CEP:</strong> ${address.cep}</p>
                                <button class="btn btn-sm btn-primary edit-btn" data-index="${index}">Editar</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Remover</button>
                            </div>
                        </div>
                    `;
            addressList.appendChild(card);
        });

        // Adiciona eventos aos botões de excluir
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                deleteAddress(parseInt(this.getAttribute('data-index')));
            });
        });
    }

    // Função para carregar e exibir endereços salvos
    function loadSavedAddresses() {
        const savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];
        addressList.innerHTML = '';

        if (savedAddresses.length === 0) {
            addressList.innerHTML = '<p class="text-center">Nenhum endereço salvo ainda.</p>';
            return;
        }


        savedAddresses.forEach((address, index) => {
            const card = document.createElement('div');
            card.className = 'col-md-6 mb-3';
            card.innerHTML = `
                        <div class="card address-card">
                            <div class="card-body">
                                <h5 class="card-title mb-0">${address.nome}</h5>
                                <p class="card-text"><strong>Email:</strong> ${address.email}</p>
                                <p class="card-text"> ${address.logradouro || 'N/A'}, N° ${address.numero || 'N/A'},</p>
                                <p class="card-text"> ${address.bairro || 'N/A'}, ${address.cidade || 'N/A'} - ${address.uf || 'N/A'}</p>
                                <p class="small class="text-muted">CEP:</strong> ${address.cep}</p>
                                <button class="btn btn-sm btn-primary edit-btn" data-index="${index}">Editar</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Remover</button>
                            </div>
                        </div>
                    `;
            addressList.appendChild(card);
        });

        // Adiciona eventos aos botões de excluir
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                deleteAddress(parseInt(this.getAttribute('data-index')));
            });
        });
    }

    // Função para excluir um endereço
    function deleteAddress(index) {
        let savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];

        if (index >= 0 && index < savedAddresses.length) {
            if (confirm('Tem certeza que deseja excluir este endereço?')) {
                savedAddresses.splice(index, 1);
                localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
                loadSavedAddresses();
            }
        }
    }
});