# sysCalculatorElo

## Mô tả hướng đi nhỏ
- Tính toán điểm Elo của 100 người chơi trong 100 trận đấu.
- Hướng đi => tạo, xử lý điểm Elo theo tỉ lệ thắng thua ngẫu nhiên. Bắt cặp 1-1
- Tạo class chứa các thông tin và cách thức xử lý Elo.
- Tạo function random người chơi
- Tạo function random cặp 1vs1 trong 100 trận đấu và tỉ lệ thắng thua random
- Trỏ về class từng người xử lý điểm và show ra

## Mô tả cách xử lý hàm
- winRate() 
- calElo() 1 player trỏ về với para (player2,result) áp dụng công thức tính elo rồi return ra

## Mô tả hướng đi khác
- Tạo player, điểm elo random có cả null, check phân loại điểm elo đang có, check null giam
- Tạo trận, kiểm tra para trận 1v1, 2v2, 3v3, 5v5
- Hàm xử lý elo check trận đơn (1vs1) tính elo đơn, trận đội != 1vs1 tính trung bình