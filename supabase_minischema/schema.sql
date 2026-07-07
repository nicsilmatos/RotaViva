CREATE TABLE entregadores (
    id UUID PRIMARY KEY REFERENCES auth.users(id), 
    nome TEXT NOT NULL,
    identificacao TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'entregador' check (role in ('entregador', 'supervisor')),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )

CREATE TABLE entregas (
    id UUID PRIMARY KEY REFERENCES gen_random_uuid(),
    entregador_id UUID NOT NULL REFERENCES entregadores(id) ON DELETE SET NULL, /*O 'on delete set null' é importante porque, se um entregador for demitido, ele tem direito que a empresa apague todos os dados relacionados a ele.*/
    codigo_pacote TEXT NOT NULL,
    destinatario_nome TEXT NOT NULL
    endereco TEXT NOT NULL
    status TEXT NOT NULL DEFAULT 'pendente' check (status in ( 'pendente', 'entregue', 'falha')),
    latitude NUMERIC,
    longitude NUMERIC, 
    foto_url TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    registrado_em TIMESTAMP WITH TIME ZONE
)