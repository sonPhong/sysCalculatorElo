# sysCalculatorElo
- xây dựng hệ thống tính elo của 100 người chơi trong 100 trận đấu gần nhất.
- điều kiện +- và hệ số điểm các bạn tự nghiên cứu.
- có thể random kết quả trận đấu của 1 số người chơi trong quá trình chạy chương trình
- thiết kế UI để xem được các thông tin đang có.

## Mô tả tổng thể hệ thống
- Player: quản lý thông tin người chơi
- Match: quản lý thông tin trận đấu
- EloScore: quản lý update điểm elo
- History: quản lý lịch sử trận đấu
- Ranking: quản lý xếp hạng
- ResetElo: reset lại elo theo condition (mùa mới, giám đốc thích,...)

## === Detail ===
- Player: có id: ; name: ; status: ; elo: ; type: ; rank: ; history: .
	+ status: random 0-1, phân tách 0 là player cũ, 1 là player mới

	+ elo:	* if status = 0 (cũ) ==> elo = random từ 500 - 1500. 
		* if status = 1 (mới) ==> elo = 1200. mặc định
		* cập nhật lại điểm mới từ class EloScore.

	+ type: * if elo < 500 ==> type = 0. else = 1. nếu = chặn không được tạo trận đấu

	+ rank: lấy thông số từ class Ranking

	+ history: chứa lịch sử tất cả trận + số điểm được tăng mỗi trận lấy về từ class history

- Match: chia đội 5 người chơi vs 5 người ngẫu nhiên. tỉ lệ thắng thua random. 

- EloScore: update elo 10 người dựa trên class Match, hệ số K là số động thay đổi được

- Ranking: if elo <= 1200 = "Con gà"; 1200 < elo <= 1300 = "Con bò"; 1300 < elo <= 1500 = "Con người" ; 1500 < elo <= 2000 = "Dị nhân". sắp xếp theo thứ tự