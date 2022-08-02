import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Popconfirm, Button, Space, Form, Input } from "antd";
import 'antd/dist/antd.min.css';
// import Item from "antd/lib/list/Item";
import { isEmpty } from "lodash";
const DataTables = () => {

    const [gridData, setGridData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingKey, setEditingKey] = useState("");
    const [editRow, setEditRow] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        loadData();
    }, [])
    const loadData = async () => {
        setLoading(true);
        const response = await axios.get("https://jsonplaceholder.typicode.com/comments");
        setGridData(response.data);
        // console.log(response.data)
        setLoading(false);
    }
    // console.log("grid Data",gridData);

    const handleDelete = (value) => {
        const dataSource = [...modifiedData];
        const filterData = dataSource.filter(item => item.id !== value.id);
        setGridData(filterData);
    }

    const modifiedData = gridData.map(({ body, ...item }) => ({
        ...item,
        key: item.id,
        comment: isEmpty(body) ? item.comment : body,
    }));

    const edit = (record) => {
        form.setFieldValue({
            name:"",
            email:"",
            comment:"",
            ...record
        });
        setEditingKey(record.key);
    };

    const save = () => { };

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        record,
        children,
        ...restProps
    }) => {
        const input = <Input />
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[
                        {
                            required: true,
                            message: `Please input ${title}`
                        }
                    ]}>
                        {input}
                    </Form.Item>
                ) : (children)}
            </td>
        )
    }


    const columns = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            align: "center",
            editable: true,
        },
        {
            title: "Email",
            dataIndex: "email",
            align: "center",
            editable: true,
        },
        {
            title: "Comment",
            dataIndex: "comment",
            align: "center",
            editable: true,
        },
        {
            title: "Actions",
            dataIndex: "actions",
            align: "center",
            render: (_, record) => {
                const editable=isEditing(record);
                return modifiedData.length >= 1 ? (
                    <Space size="middle">
                        <Popconfirm
                            title="Are you Sure to delete?"
                            onConfirm={() => handleDelete(record)}
                        >
                            <Button type="primary" danger>
                                Delete
                            </Button>
                        </Popconfirm>
                        {editRow ? (
                            <span>
                                <Space>
                                    <Button onClick={(e) => {
                                        save(record.key);
                                    }} type="primary" style={{ marginRight: 8 }}>Save</Button>
                                    <Popconfirm
                                        title="Sure to cancel?"
                                        onConfirm={() => edit(record)}
                                    >
                                        <Button>Cancel</Button>
                                    </Popconfirm>
                                </Space>
                            </span>
                        ) : (
                            <Button onClick={() => edit(record)} type="primary">Edit</Button>
                        )}
                    </Space>
                ) : null
            },
        },
    ]

    // console.log("modifieddata",modifiedData);

    const isEditing = (record) => {
        return record.key === editingKey;
    }


    const mergedColumn = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),

            })
        }
    })

    return (
        <div>
            <Form form={form} component={false}>
                <Table components={{
                    body:{
                        cell:EditableCell,

                    },
                }}
                    columns={mergedColumn}
                    dataSource={modifiedData}
                    bordered
                    loading={loading}
                />
            </Form>

        </div>
    );
}

export default DataTables;