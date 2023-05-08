import React, { useState, useEffect } from "react";
import axios from "axios";
import AuctionCreate from '../components/AuctionCreate';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TextField,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';

function AdminPanel() {
  const [lots, setLots] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "", category_file: null });

  useEffect(() => {
    axios.get("http://localhost:8000/api_v1/auctions/status/ON_MODERATE").then((response) => {
      setLots(response.data);
    });
    axios.get("http://localhost:8000/api_v1/auctions/category/").then((response) => {
      setCategories(response.data);
    });
  }, []);

  const deleteLot = (auction_id) => {
    axios.delete(`http://localhost:8000/api_v1/auction/${auction_id}`).then((response) => {
      setLots(lots.filter((lot) => auction_id !== auction_id));
    });
  };

  const addCategory = () => {
    const formData = new FormData();
    formData.append("name", newCategory.name);
    formData.append("description", newCategory.description);
    formData.append("category_file", newCategory.category_file);

    axios.post("http://localhost:8000/moderate/category/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => {
      setCategories([...categories, response.data]);
      setNewCategory({ name: "", description: "", category_file: null });
      setShowCategoryForm(false);
    });
  };

  const deleteCategory = (categoryId) => {
    axios.delete(`http://localhost:8000/api_v1/auctions/category/${categoryId}`)
      .then((response) => {
        setCategories(categories.filter((category) => category.id !== categoryId));
      });
  };

  const refreshLots = () => {
    axios.get("http://localhost:8000/api_v1/auctions").then((response) => {
      setLots(response.data);
    });
  }

  const acceptAuction = (auction_id) => {
    axios.post(`http://localhost:8000/moderate/auction/${auction_id}/accept`)
      .then((response) => {
        refreshLots();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const declineAuction = (auction_id) => {
    axios.post(`http://localhost:8000/moderate/auction/${auction_id}/decline`)
      .then((response) => {
        refreshLots();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      {showCreateForm ? (
        <AuctionCreate state={setShowCreateForm} />
      ) : (
        <>
          <Button variant="contained" color="primary" onClick={() => setShowCreateForm(true)}>Создать аукцион</Button>
          <Button variant="contained" color="secondary" onClick={() => refreshLots()}>Обновить</Button>
<br />
<br />
<Typography variant="h6">Список аукционов</Typography>
<Table>
    <TableHead>
        <TableRow>
          <TableCell>Id</TableCell>
          <TableCell>Название</TableCell>
          <TableCell>Категория</TableCell>
          <TableCell>Мин. ставка</TableCell>
          <TableCell>Цена быстрой продажи</TableCell>
          <TableCell>Статус</TableCell>
          <TableCell>Начало</TableCell>
          <TableCell>Окончание</TableCell>
          <TableCell>Одобрить</TableCell>
          <TableCell>Отклонить</TableCell>
          <TableCell>Удалить</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {lots.map((lot) => (
          <TableRow key={lot.id}>
            <TableCell>{lot.id}</TableCell>
            <TableCell>{lot.lot_name}</TableCell>
            <TableCell>{lot.lot_category}</TableCell>
            <TableCell>{lot.lot_min_bet}</TableCell>
            <TableCell>{lot.lot_sell_price}</TableCell>
            <TableCell>{lot.lot_status}</TableCell>
            <TableCell>{lot.lot_start_time}</TableCell>
            <TableCell>{lot.lot_end_time}</TableCell>
          <TableCell>
              <Button variant="contained" color="primary" onClick={() => acceptAuction(lot.id)}>Одобрить</Button>
              </TableCell>
              <TableCell>
              <Button variant="contained" color="secondary" onClick={() => declineAuction(lot.id)}>Отклонить</Button>
              </TableCell>
              <TableCell>
              <Button variant="contained" color="secondary" onClick={() => deleteLot(lot.id)}>Удалить</Button>
              </TableCell>
              </TableRow>
))}
<Table>
        <TableHead>
          <TableRow>
            <TableCell>Имя</TableCell>
            <TableCell>Описание</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => deleteCategory(category.id)}>Удалить</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
  </Table>
</TableBody>
</Table>
<br />
<br />
<Typography variant="h6">Категории</Typography>
{showCategoryForm ? (
<div>
<TextField
label="Название"
value={newCategory.name}
onChange={(event) =>
setNewCategory({ ...newCategory, name: event.target.value })
}
/>
<br />
<br />
<TextField
label="Описание"
value={newCategory.description}
onChange={(event) =>
setNewCategory({
...newCategory,
description: event.target.value,
})
}
/>
<br />
<br />
<input
type="file"
onChange={(event) =>
setNewCategory({
...newCategory,
category_file: event.target.files[0],
})
}
/>
<br />
<br />
<Button variant="contained" color="primary" onClick={addCategory}>
Добавить категорию
</Button>
<Button
variant="contained"
color="secondary"
onClick={() => setShowCategoryForm(false)}
>
Отмена
</Button>
</div>
) : (
<div>
<Button
variant="contained"
color="primary"
onClick={() => setShowCategoryForm(true)}
>
Добавить категорию
</Button>
<br />
<br />
<List>
{categories.map((category) => (
<ListItem key={category.id}>
</ListItem>
))}
</List>
</div>
)}
</>
)}
</div>
);
}

export default AdminPanel;