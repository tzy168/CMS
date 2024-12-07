import { useEffect, useState } from "react";
import { getArticleListAPI } from "../../apis/article";
import { Card, Image, Typography, Alert } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const Home = () => {
    const [articles, setArticles] = useState([]);

    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const reqData = {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: '',
        page: '',
        per_page: '',
    }
    useEffect(() => {
        const fetchArticles = async () => {

            try {
                const res = await getArticleListAPI(reqData);
                if (res && res.data) {
                    setArticles(res.data.results);
                } else {
                    throw new Error('数据格式不正确');
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchArticles();
    }, [reqData]);

    if (error) {
        return <Alert message={error} type="error" showIcon />;
    }

    return (
        <div className='home' style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <Card style={{ marginBottom: 20 }}>
                {articles.map((item, index) => (
                    <div
                        key={item.id}
                        style={{
                            marginBottom: 20,
                            display: 'flex',
                            alignItems: 'center',
                            borderBottom: index !== articles.length - 1 ? '1px solid #e8e8e8' : 'none', // 添加分隔线
                            paddingBottom: 10, // 可选：为分隔线下方添加一些间距
                        }}
                        onClick={() => navigate(`/${item.id}`)}
                    >
                        {item.cover.images && item.cover.images[0] && (
                            <Image
                                width={80}
                                height={80}
                                src={item.cover.images[0]}
                                style={{ marginRight: '20px' }} // 增加了右边距
                                alt="封面"
                            />
                        )}
                        <div style={{ flex: 1 }}>
                            <Title level={4} style={{ margin: 0, marginLeft: 10 }}>{item.title}</Title>
                            <Paragraph ellipsis={{ rows: 2, expandable: false }} style={{ marginLeft: 10 }}>
                                ...
                            </Paragraph>
                            <Paragraph type="secondary" style={{ margin: 0, marginLeft: 10 }}>
                                发布时间: {new Date(item.pubdate).toLocaleString()} | 阅读数: {item.read_count}
                            </Paragraph>
                        </div>
                    </div>
                ))
                }
            </Card >
        </div >
    );
};

export default Home;
