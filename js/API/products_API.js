//========= Cấu Hình API =========
//--Địa Chỉ Backend server 
const API_BASE_URL = "http://127.0.0.1:6346/api";
//--Danh sách các API endpoints (Đường dẫn API)
const API_ENDPOINTS = {
  products: "/products", //lấy danh sách sản phẩm
  stats: "/products/stats", //lấy thống kê sản phẩm
  filterOptions: "/products/filter-options", //lấy tùy chọn lọc
  brands: "/products/brands", // lấy danh sách thương hiệu
  categories: "/products/categories", // lấy danh sách danh mục
};

// ========== Tạo Lớp API SERVICE ==========

// Lớp ProductAPIService - chứa tất cả phương thức gọi API liên quan đến sản phẩm
class ProductAPIService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.headers = {
      "Content-Type": "application/json", //// Dữ liệu gửi đi là JSON
      Accept: "application/json", // Chấp nhận dữ liệu trả về là JSON
    };
  }
// ========== PHƯƠNG THỨC CƠ BẢN ĐỂ GỌI API ==========
  
  /**
   * Hàm request chung để gọi API
   * @param {string} endpoint - Đường dẫn API (vd: "/products")
   * @param {object} options - Tùy chọn request (method, body, headers)
   * @returns {Promise} - Promise chứa dữ liệu từ API
   */

  async request(endpoint, options = {}) {
    try {
       // Tạo URL đầy đủ bằng cách nối baseUrl và endpoint
      const url = `${this.baseUrl}${endpoint}`;

      console.log("🔗 Requesting URL:", url); // Debug: In ra URL được gọi
      if (options.body) {
        console.log("📦 Request body:", JSON.parse(options.body));
      }

      // Gửi request tới server bằng fetch API
      const response = await fetch(url, {
        ...options, // Sao chép các tùy chọn từ tham số
        headers: { ...this.headers, ...options.headers }, // Kết hợp headers mặc định và tùy chọn
      });
      
      // Lấy dữ liệu từ response (có thể là JSON hoặc text)
      let data;
      try {
        data = await response.json();
      } catch (e) {
        // Nếu response không phải JSON, lấy text
        data = await response.text();
      }
      
      // Kiểm tra nếu response không thành công (status code không trong khoảng 200-299)
      if (!response.ok) {
        // Xử lý các lỗi HTTP khác nhau
        const errorObj = {
          status: response.status,
          statusText: response.statusText,
          url: url,
          message: data?.message || data?.error || response.statusText,
          data: data
        };
        
        console.error("❌ HTTP Error!", errorObj);
        
        // Tạo error message chi tiết dựa trên status code
        let userMessage = "";
        switch (response.status) {
          case 400:
            userMessage = "Yêu cầu không hợp lệ";
            break;
          case 401:
            userMessage = "Không có quyền truy cập";
            break;
          case 403:
            userMessage = "Bị cấm truy cập";
            break;
          case 404:
            userMessage = "Không tìm thấy tài nguyên";
            break;
          case 422:
            userMessage = `Dữ liệu không hợp lệ: ${errorObj.message}`;
            if (data?.errors) {
              console.error("📋 Validation errors:", data.errors);
              userMessage += "\nLỗi chi tiết: " + JSON.stringify(data.errors);
            }
            break;
          case 500:
            userMessage = "Lỗi server (500)";
            break;
          default:
            userMessage = `Lỗi HTTP ${response.status}: ${response.statusText}`;
        }
        
        const error = new Error(userMessage);
        error.status = response.status;
        error.data = errorObj;
        throw error;
      }
      
      // Trả về dữ liệu JSON từ response
      console.log('✅ API response:', data); // Log dữ liệu nhận được
      console.log('Response structure check:', {
        isArray: Array.isArray(data),
        hasSuccess: 'success' in data,
        hasData: 'data' in data,
        dataType: typeof data.data,
        dataIsArray: Array.isArray(data.data)
      });
      return data;

    } catch (error) {
      // Bắt lỗi và log ra console với chi tiết
      console.error("💥 API Error:", error.message);
      console.error("Error details:", {
        status: error.status,
        data: error.data
      });
      
      // Ném lỗi để xử lý ở nơi gọi hàm
      throw error;
    }
  }

  //Lấy danh sản phẩm
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.products}?${queryString}`
      : API_ENDPOINTS.products;
    
    console.log("🔗 API Request URL:", `${this.baseUrl}${endpoint}`);
    console.log("📤 Parameters:", params);
    
    return this.request(endpoint);
  }

  // Lấy sản phẩm theo ID
  async getProductById(id) {
    return this.request(`${API_ENDPOINTS.products}/${id}`);
  }

  // Tạo sản phẩm mới
  async createProduct(productData) {
    return this.request(API_ENDPOINTS.products, {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  // Cập nhật sản phẩm
  async updateProduct(id, productData) { 
    return this.request(`${API_ENDPOINTS.products}/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }
  // Xóa sản phẩm
  async deleteProduct(id) {
    return this.request(`${API_ENDPOINTS.products}/${id}`, {
      method: "DELETE",
    });
  }

  // Lấy thống kê
  async getStats() {
    return this.request(API_ENDPOINTS.stats);
  }

  // Lấy tùy chọn lọc
  async getFilterOptions() {
    return this.request(API_ENDPOINTS.filterOptions);
  }

  // Lấy danh sách thương hiệu
  async getBrands() {
    return this.request(API_ENDPOINTS.brands);
  }

  // Lấy danh sách danh mục
  async getCategories() {
    return this.request(API_ENDPOINTS.categories);
  }
}

// Tạo instance toàn cục
const productAPI = new ProductAPIService();
