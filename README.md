# sysCalculatorElo
- xây dựng hệ thống tính elo của 100 người chơi trong 100 trận đấu gần nhất.
- điều kiện +- và hệ số điểm các bạn tự nghiên cứu.
- có thể random kết quả trận đấu của 1 số người chơi trong quá trình chạy chương trình
- thiết kế UI để xem được các thông tin đang có.

## Mô tả tổng thể hệ thống
- Player: quản lý thông tin người chơi
- Match: quản lý thông tin trận đấu
- EloScore: quản lý update điểm elo
- Ranking: xử lý xếp hạng
- RankingBoard: hiện bảng xếp hạng
- MatchStats: thống kê thông số trận đấu
- ResetElo: reset lại elo theo condition (mùa mới, giám đốc thích,...)


## Hướng xử lý
- tạo ra các các đối tượng chính    +Player
                                    +Match
                                    +EloScore
                                    +Ranking
                                    +RankingBoard
                                    +MatchStats

- Player: tạo đối tượng người chơi gồm thông tin cần, bắt buộc có status và type từ đầu để check điều kiện
- Match: tạo ra đội đấu 
- EloScore: xử lý điểm, tạo ra thông tin lưu về Player
- Ranking: tạo phân loại xếp hạng
- RankingBoard: dựa vào Player và Ranking lấy thông tin tính toán và hiển thị sắp xếp thứ hạng
- MatchStats: mở rộng, bổ sung sau, thống kê toàn bộ thông tin liên quan người chơi, trận đấu

## Mô tả chi tiết feature và cần mở rộng
- Player:   + Định nghĩa thông tin người chơi (ID,Name,Status,Elo,Type,Rank,History,Win,Lose,HistoryMatch,initialElo)
            + Phương thức updateElo() đưa elo mới vào thay đổi và cập nhật lên elo, thay đổi history với thông số (win, oldElo, newElo, eloChange), call updateType()
            + updateRank() gọi tới class Ranking xử lý trả về
            + recordMatch() xử lý và ghi lại thông tin về đấu và thắng thua rồi udate qua history
            + updateMathHistory() ghi lại thông tin mọi thứ sau cùng
            + getWinRate() trả về tỉ lệ thắng từng người chơi sau tính toán
            + getMatchHistoryDetail() trả về thông tin

- Match:    + phân đội, xử lý thắng thua random với determineWinner() 
            + trả về tỉ lệ random và đội thắng

- Elo:Score:
            + xử lý điểm với hệ số K gán cứng 32
            + tính điểm chênh lệch theo tỉ lệ thắng expectedScore()
            + cập nhật và tính toán 2 người chơi gọi về Plảye với updateElo() trả ra thông tin 2 người và mức điểm thay đổi
            + cập nhật và tính toán elo người chơi dựa trên elo trung bình đội với updateMatchElo() sau đó gọi về Playẻ ghi két qủa, return 1 thông tin all người chơi
            + 

- Ranking:  + cập nhật mức rank, theo condition dựa trên elo, return tên rank getRank()
            + return 1 sô nguyên để check thứ hạng giống condition trên getRankIndex()

- RankingBoard: 
            + nhận mảng chưa Player và Ranking để sắp xếp và return

- MatchStats:
            + thống kê tổng thể generate, duyệt qua Player lấy history return
            + thống kê cá nhân generatePlayerStats() return thông tin condition
            + gán cho all đối tượng generateAllPlayerStats()
            + generateEloHistory() tạo lịch sử thay đổi elo, đang dùng time mặc định
            + findCommonOpponents() tìm lịch sử đối đầu
            + generatePerformanceReport() tạo bảng xếp hạng tăng elo cao, tỉ lệ win cao

