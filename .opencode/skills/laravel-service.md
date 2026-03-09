Service Layer Skill

Business logic Service sınıflarında bulunur.

Konum:

app/Services

Örnek:

class OrderService
{
    public function create(array $data)
    {
        return Order::create($data);
    }
}