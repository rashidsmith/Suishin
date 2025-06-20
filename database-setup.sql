-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    ibo_id TEXT NOT NULL,
    learning_objective_id TEXT NOT NULL,
    target_duration INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('C1', 'C2', 'C3', 'C4')),
    duration INTEGER NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activities_card_id ON activities(card_id);
CREATE INDEX IF NOT EXISTS idx_activities_order ON activities(card_id, order_index);
CREATE INDEX IF NOT EXISTS idx_cards_ibo_id ON cards(ibo_id);

-- Enable Row Level Security (RLS) if needed
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for now (adjust based on your auth requirements)
CREATE POLICY "Allow all operations on cards" ON cards FOR ALL USING (true);
CREATE POLICY "Allow all operations on activities" ON activities FOR ALL USING (true);