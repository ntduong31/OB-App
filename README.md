
# Ứng Dụng Phát Hiện Đối Tượng Thời Gian Thực

Đây là một ứng dụng web cho phép phát hiện đối tượng trong thời gian thực bằng camera của thiết bị. Toàn bộ quá trình xử lý (từ việc nhận diện đến vẽ hộp giới hạn) đều diễn ra trực tiếp trên trình duyệt của người dùng, đảm bảo tốc độ nhanh, độ trễ thấp và bảo mật dữ liệu (hình ảnh từ camera không được gửi đến bất kỳ máy chủ nào).

Ứng dụng sử dụng **TensorFlow.js** với mô hình **COCO-SSD** đã được huấn luyện sẵn để nhận diện 80 loại đối tượng phổ biến.

## Tính Năng Chính

- **Phát Hiện Real-time**: Sử dụng `requestAnimationFrame` để xử lý liên tục video từ camera, mang lại trải nghiệm mượt mà.
- **Xử Lý Phía Client**: Không yêu cầu backend hay server. Mọi tính toán đều do trình duyệt của bạn thực hiện, giúp ứng dụng hoạt động offline sau lần tải đầu tiên.
- **Giao Diện Điều Khiển Nâng Cao**:
  - **Ngưỡng Tin Cậy (Confidence Threshold)**: Điều chỉnh độ nhạy của mô hình.
  - **Lọc Đối Tượng**: Chọn chính xác các lớp đối tượng bạn muốn phát hiện.
  - **Tối Ưu Hiệu Năng**: Tùy chỉnh số lượng phát hiện tối đa, tần suất xử lý (frame skipping), và độ phân giải đầu vào để cân bằng giữa tốc độ và độ chính xác.
- **Tùy Chỉnh Hiển Thị**: Bật/tắt hộp giới hạn (bounding box) và nhãn tên đối tượng.
- **Thiết Kế Responsive**: Hoạt động tốt trên cả máy tính để bàn và thiết bị di động.

## Lưu Ý Kỹ Thuật

Dự án này được xây dựng để đáp ứng yêu cầu về một ứng dụng **chạy real-time, không gọi API bên ngoài và có thể triển khai trên mobile một cách dễ dàng**. Do đó, chúng tôi đã chọn giải pháp client-side với TensorFlow.js thay vì Python và YOLOv8 (vốn yêu cầu một môi trường backend để chạy mô hình). Cách tiếp cận này có những ưu điểm:

- **Không cần cài đặt phức tạp**: Người dùng chỉ cần mở một trang web.
- **Bảo mật**: Dữ liệu video không bao giờ rời khỏi thiết bị của người dùng.
- **Hiệu năng cao**: Tận dụng sức mạnh xử lý của GPU trên thiết bị thông qua WebGL do TensorFlow.js hỗ trợ.

## Hướng Dẫn Cài Đặt và Triển Khai

Vì đây là một ứng dụng web tĩnh hoàn toàn chạy trên trình duyệt, việc cài đặt và triển khai vô cùng đơn giản.

### Yêu Cầu

- Một trình duyệt web hiện đại hỗ trợ WebGL và API `getUserMedia` (ví dụ: Google Chrome, Firefox, Safari, Edge).
- Kết nối Internet cho lần tải đầu tiên (để tải các thư viện và mô hình).

### Chạy trên máy cục bộ (Local)

Bạn có hai cách để chạy dự án này trên máy của mình:

#### Cách 1: Mở trực tiếp (Không khuyến khích)

Bạn có thể mở trực tiếp tệp `index.html` bằng trình duyệt. Tuy nhiên, một số trình duyệt có thể chặn các yêu cầu JavaScript vì lý do bảo mật (lỗi CORS), khiến mô hình không thể tải được.

#### Cách 2: Sử dụng một máy chủ web cục bộ (Khuyến khích)

Đây là cách tốt nhất để đảm bảo mọi thứ hoạt động chính xác.

**Nếu bạn đã cài đặt Python:**

1.  Mở terminal hoặc command prompt trong thư mục gốc của dự án.
2.  Chạy lệnh sau:
    ```bash
    # Đối với Python 3
    python -m http.server
    ```
3.  Mở trình duyệt và truy cập vào địa chỉ `http://localhost:8000`.

**Nếu bạn sử dụng Visual Studio Code:**

1.  Cài đặt extension có tên là **Live Server**.
2.  Sau khi cài đặt, nhấp chuột phải vào tệp `index.html` trong VS Code và chọn "Open with Live Server".
3.  Trình duyệt sẽ tự động mở trang web cho bạn.

### Triển khai lên môi trường khác (Deployment)

Để triển khai ứng dụng cho người khác sử dụng, bạn chỉ cần tải toàn bộ các tệp của dự án (`index.html`, `index.tsx`, `components/`, v.v.) lên bất kỳ dịch vụ hosting web tĩnh nào.

Một số dịch vụ miễn phí và dễ sử dụng:
-   GitHub Pages
-   Vercel
-   Netlify
-   Firebase Hosting

Bạn chỉ cần kéo-thả thư mục dự án hoặc liên kết nó với kho chứa Git của bạn, và dịch vụ sẽ tự động triển khai trang web.

## Hướng Dẫn Sử Dụng

1.  Mở ứng dụng trên trình duyệt.
2.  Trình duyệt sẽ yêu cầu quyền truy cập camera. Hãy nhấn **"Allow" (Cho phép)**.
3.  Hướng camera của thiết bị về phía các vật thể bạn muốn nhận diện.
4.  Các hộp giới hạn và nhãn sẽ xuất hiện xung quanh các đối tượng được phát hiện.
5.  Sử dụng các thanh trượt và tùy chọn trong bảng điều khiển ở phía dưới để tinh chỉnh quá trình phát hiện cho phù hợp với nhu cầu của bạn.

## Các Thư Viện Được Sử Dụng

-   **React**: Thư viện JavaScript để xây dựng giao diện người dùng.
-   **TensorFlow.js**: Nền tảng machine learning mã nguồn mở của Google để chạy các mô hình AI trên trình duyệt và Node.js.
-   **COCO-SSD Model**: Một mô hình phát hiện đối tượng nhẹ, được huấn luyện trên bộ dữ liệu COCO, tối ưu cho việc chạy trên các thiết bị có cấu hình hạn chế.
-   **Tailwind CSS**: Framework CSS giúp tạo kiểu giao diện nhanh chóng và tiện lợi.
